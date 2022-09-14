export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        {
            title: 'User',
            name: 'user',
            type: 'reference',
            to: [{type: 'user'}],
            options: {
                disableNew: true,
            }
        },
        {
            name: 'userName',
            title: 'User Name',
            type: 'string',
        },
        {
            name: 'itemsPrice',
            title: 'items price',
            type: 'number',
        },
        {
            name: 'shippingPrice',
            title: 'shipping price',
            type: 'number',
        },
        {
            name: 'taxPrice',
            title: 'tax price',
            type: 'number',
        },
        {
            name: 'totalPrice',
            title: 'total price',
            type: 'number',
        },
        {
            name: 'paymentMethod',
            title: 'Payment Method',
            type: 'string',
        },
        {
            name: 'shippingAddress',
            title: 'Shipping Address',
            type: 'shippingAddress',
        },
        {
            name: 'paymentResult',
            title: 'Payment Result',
            type: 'paymentResult',
        },
        {
            title: 'Order Items',
            name: 'orderItems',
            type: 'array',
            of: [
                {
                    title: 'Order Item',
                    type: 'orderItem',
                }
            ]
        },
        {
            title: 'IsPaid',
            name: 'isPaid',
            type: 'boolean',
          },
          {
            title: 'Paid Date',
            name: 'paidAt',
            type: 'datetime',
          },
          {
            title: 'IsDelivered',
            name: 'isDelivered',
            type: 'boolean',
          },
          {
            title: 'DeliveredAt',
            name: 'deliveredAt',
            type: 'datetime',
          },
          {
            title: 'CreatedAt',
            name: 'createdAt',
            type: 'datetime',
          },
    ]
}