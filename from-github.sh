#!/bin/sh
curl -Ss $(node $(dirname $0)/convert-github $1) | node $(dirname $0) - $3 > $2
