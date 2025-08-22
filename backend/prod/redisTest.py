import redis
import json

redis_client = redis.StrictRedis(host='192.168.0.110', port=6379, db=0)

def redis_test():
    redis_key = "RTest"
    value = {"hello": "helloBack", "text": "value"}
    redis_client.set(redis_key, json.dumps(value))

    redis_get = redis_client.get(redis_key)
    json_data = json.loads(redis_get.decode())
    print(json_data)
    json_data['hello'] = "New Hello!"
    redis_client.set(redis_key, json.dumps(json_data))
    json_data_modified = json.loads(redis_client.get(redis_key).decode())
    print(json_data_modified)

if __name__ == "__main__":
    redis_test()