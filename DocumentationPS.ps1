#Setting Global Variables
Clear-Variable Matches
$regexObj = @()
#Scanning Script.js
$file_string = Get-Content .\public\script.js
Foreach ($line in $file_string)
{
    $line -match "\* Method: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Class: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Pre: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Params: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Post: (?<thing>[\w /:'\.,;]+)"
    if ($Matches.Count -gt 1) {
        $regexObj += $Matches.thing
    }
    Clear-Variable Matches
}
#Scanning Ship.js
$file_string = Get-Content .\public\ship.js
Foreach ($line in $file_string)
{
    $line -match "\* Method: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Class: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Pre: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Params: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Post: (?<thing>[\w /:'\.,;]+)"
    if ($Matches.Count -gt 1) {
        $regexObj += $Matches.thing
    }
    Clear-Variable Matches
}
#Scanning Space.js
$file_string = Get-Content .\public\space.js
Foreach ($line in $file_string)
{
    $line -match "\* Method: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Class: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Pre: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Params: (?<thing>[\w /:'\.,;]+)"
    $line -match "\* Post: (?<thing>[\w /:'\.,;]+)"
    if ($Matches.Count -gt 1) {
        $regexObj += $Matches.thing
    }
    Clear-Variable Matches
}
$regexObj
$counter = 0
Set-Content -Path .\documentation\Documentation.html -Value "
<!DOCTYPE html>
    <head>
        <title>Documentation</title>
    </head>
    <body>"
While ($counter -lt $regexObj.Count)
{
    $method = $regexObj[$counter]
    $pre = $regexObj[$counter+1]
    $params = $regexObj[$counter+2]
    $post = $regexObj[$counter+3]
    Add-Content -Path .\documentation\Documentation.html -Value "
        <h2>Method: $method</h2>
        <h3>Pre Conditions: $pre</h3>
        <h3>Params: $params</h3>
        <h3>Post Conditions: $post</h3>"
    $counter += 4
}
Add-Content -Path .\documentation\Documentation.html -Value "</body>"
Write-Host "DONE"