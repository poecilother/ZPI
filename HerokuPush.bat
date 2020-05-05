@echo off

echo Starting HerokuPush script

git add server

echo Added server to local repository

git commit -m "A lot of changes"

echo Added new commit

git subtree push --prefix server heroku master

echo Pushed to heroku master
