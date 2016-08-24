.PHONY: role policy deploy

role:
	aws iam create-role --role-name CoffeeRole --assume-role-policy-document file://assume_role_policy.json

policy:
	aws iam put-role-policy --role-name CoffeeRole --policy-name DynamoDBPolicy --policy-document file://policy.json

deploy:
	chalice deploy

clean-dynamo:
	aws dynamodb delete-table --table-name coffees
	aws dynamodb delete-table --table-name users
	aws dynamodb delete-table --table-name topics
