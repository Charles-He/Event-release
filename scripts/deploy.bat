cd ../../rgb
call env.bat
cd cmd/rgb
go build -o rgb.exe main.go
rgb.exe -env dev &