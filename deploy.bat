@echo off
echo ZIVAH International Deployment
echo ==============================

echo Building...
npm run build

echo Generating Prisma...
npx prisma generate

echo Creating deploy folder...
if exist deploy rmdir /s /q deploy
mkdir deploy

echo Copying files...
copy package.json deploy\
copy server.js deploy\
copy next.config.ts deploy\
xcopy .next deploy\.next\ /e /i /h /y
xcopy public deploy\public\ /e /i /h /y
xcopy src deploy\src\ /e /i /h /y
xcopy prisma deploy\prisma\ /e /i /h /y

echo Creating ZIP...
powershell "Compress-Archive -Path deploy\* -DestinationPath zivah-deploy.zip -Force"

echo Ready for upload!
echo.
set /p "upload=Upload via FTP to ftp.zivahinternational.com? (y/N): "
if /i "%upload%"=="y" goto :ftp_upload
echo Manual upload: Use cPanel File Manager
pause
goto :end

:ftp_upload
echo.
echo FTP Upload to ftp.zivahinternational.com
powershell -Command "$ftp='ftp.zivahinternational.com'; $user='zivahint'; $path='/public_html/zivah-app'; Write-Host 'Enter password for zivahint:'; $pass=Read-Host -AsSecureString; $pass=[Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)); try { $req=[System.Net.FtpWebRequest]::Create(\"ftp://$ftp$path/zivah-deploy.zip\"); $req.Method=[System.Net.WebRequestMethods+Ftp]::UploadFile; $req.Credentials=New-Object System.Net.NetworkCredential($user,$pass); $req.UseBinary=$true; $req.UsePassive=$true; $data=[System.IO.File]::ReadAllBytes('zivah-deploy.zip'); $req.ContentLength=$data.Length; $stream=$req.GetRequestStream(); $stream.Write($data,0,$data.Length); $stream.Close(); $resp=$req.GetResponse(); $resp.Close(); Write-Host 'Upload successful! Extract in cPanel File Manager.'; } catch { Write-Host 'Upload failed:' $_.Exception.Message; }"
pause

:end
