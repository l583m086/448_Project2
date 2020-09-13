Clear-Variable Matches
$regexObj = @()
#Scanning Package-Lock.json
$file_string = Get-Content .\package-lock.json
Foreach ($line in $file_string)
{
    $line -match '^    "(?<thing>([\w\.-]+))": '
    $line -match '^      "version": "(?<thing>[\w:/.-]+)",'
    $line -match '^      "resolved": "(?<thing>[\w:/.-]+)",'
    if ($Matches.Count -gt 1) {
        $regexObj += $Matches.thing
    }
    Clear-Variable Matches
}
Set-Content -Path .\documentation\workscited.md -Value "
# Works Cited

## NPM Packages (Only packages necessary to run Node.js live server)"
$regexObj
$counter = 0
While ($counter -lt $regexObj.Count)
{
    $value = $regexObj[$counter]
    $version = $regexObj[$counter+1]
    $url = $regexObj[$counter+2]
    Add-Content -Path .\documentation\workscited.md -Value "
- **$value** @ $version
    - URL: $url"
    $counter += 3
}
Write-Host "DONE"