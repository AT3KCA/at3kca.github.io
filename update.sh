time=$(date "+%Y/%m/%d")

git status
git add .

git commit -m "update $time"

gt push origin main
