### Assumptions

amazon s3 storage price = 0.023 USD/GB/month  
amazon s3 request price = 0.0004 USD/1000 request  
cfx APY = 0.04

### Equactions

number of CFX needed to be staked for storage = {amazon s3 price per GB per month} / (1024MB / {file size}) * 12 / {cfx
price} / {cfx APY}  
number of CFX needed to be staked for request = {amazon s3 price per 1000 request} * 12 / {cfx price} / {cfx APY}  
total = number of CFX needed to be staked for storage + number of CFX needed to be staked for request  
commission = total * 3

### Examples

let cfx price = 0.2, file size = 20MB, request = 1000/month  
number of CFX needed to be staked for storage = 0.023 / (1024MB / 20MB) * 12 / 0.2 / 0.04 = 0.69cfx  
number of CFX needed to be staked for request = 0.0004 * 12 / 0.2 / 0.04 = 0.6cfx  
total = 1.29cfx
