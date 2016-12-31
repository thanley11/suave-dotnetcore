#To run
cd /app
npm install
ng build

cd ..

docker build -t suave-dotnetcore .

docker run --rm -it suave-dotnetcore


