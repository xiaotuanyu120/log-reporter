import subprocess
import select

import redis

r = redis.StrictRedis(host="127.0.0.1", port=6379)
filename = '/tmp/test.log'
f = subprocess.Popen(['tail','-F',filename],\
        stdout=subprocess.PIPE,stderr=subprocess.PIPE)
p = select.poll()
p.register(f.stdout)

# p.poll(timeout)
while True:
    if p.poll(1):
        r.publish('logchannel', f.stdout.readline())
