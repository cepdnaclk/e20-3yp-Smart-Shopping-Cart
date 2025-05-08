// Import AWS SDK (built-in in AWS Lambda)
const AWS = require('aws-sdk');

// Initialize DynamoDB DocumentClient
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambda_handler = async (event) => {
    console.log('Received event:', JSON.stringify(event));

    const barcode = event.barcode;

    if (!barcode) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Barcode not provided' })
        };
    }

    const params = {
        TableName: 'cart_items',
        Key: { barcode },
        UpdateExpression: 'SET quantity = if_not_exists(quantity, :start) + :inc',
        ExpressionAttributeValues: {
            ':start': 0,
            ':inc': 1
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const result = await dynamodb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Item with barcode ${barcode} updated successfully`,
                updatedAttributes: result.Attributes
            })
        };
    } catch (error) {
        console.error('Error updating item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error updating DynamoDB', error: error.message })
        };
    }
};
