from rest_framework import serializers
from .models import Customer, Invoice, InvoiceItem

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ('id', 'description', 'quantity', 'unit_price', 'amount')
        read_only_fields = ('amount',)

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Invoice
        fields = ('id', 'customer', 'customer_name', 'date', 'due_date', 'status', 'total_amount', 'items')
        read_only_fields = ('total_amount',)

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        invoice = Invoice.objects.create(**validated_data)
        total_amount = 0
        for item_data in items_data:
            item = InvoiceItem.objects.create(invoice=invoice, **item_data)
            total_amount += item.amount
        invoice.total_amount = total_amount
        invoice.save()
        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items')
        instance = super().update(instance, validated_data)

        # This is a simplified update. A real implementation would handle
        # creating, updating, and deleting items more robustly.
        instance.items.all().delete()
        total_amount = 0
        for item_data in items_data:
            item = InvoiceItem.objects.create(invoice=instance, **item_data)
            total_amount += item.amount
        instance.total_amount = total_amount
        instance.save()
        return instance
