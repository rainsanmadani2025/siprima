#!/bin/bash
cd /home/z/my-project
pkill -f "bun next dev"
pkill -f "next dev"
sleep 2
nohup bun run dev > /home/z/my-project/dev.log 2>&1 &
echo "Dev server restarted at $(date)" >> /home/z/my-project/restart.log
