time=$(date "+%Y/%m/%d")

git status
git add .

git commit -m "update $time"

git push origin main
