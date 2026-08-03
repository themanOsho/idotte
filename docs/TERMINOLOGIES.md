# Pro-Tip: 

Turn them into Permanent ShortcutsIf you don't want to copy and paste these long commands every time, you can save them as temporary helper variables during your terminal session.Run this once in your open PowerShell window:

powershell:
function Find-Student ($name) { $json = Get-Content -Raw "src/admission/data/admission_datastream.json" | ConvertFrom-Json; $res = @(); foreach ($z in $json.psobject.Properties) { foreach ($s in $z.Value.psobject.Properties) { foreach ($st in $s.Value) { if ($st.fullName -like "*$name*") { $res += [PSCustomObject]@{ "Zone"=$z.Name; "School"=$s.Name; "S/N"=$st.serialNumber; "Admission No."=$st.admissionNumber; "Sex"=$st.sex } } } } }; $res | Format-Table -AutoSize }

Now, for the rest of the day, you can search for anyone instantly by typing a single clean line:

powershell:
Find-Student "MARDIYYAH"

# OTHER WAY:
Make sure you run these from your project root folder (C:\...\Idotte) or adjust the file path dynamically.
------------------------------
## Command 1: Search for a Student Name
This command scans every student across all zones and schools. It outputs their match record, their location coordinates, and formats the output into a clean tabular layout.

### Copy and paste this command into your Windows PowerShell window:

$json = Get-Content -Raw "src/admission/data/admission_datastream.json" | ConvertFrom-Json; $results = @(); foreach ($zone in $json.psobject.Properties) { foreach ($school in $zone.Value.psobject.Properties) { foreach ($student in $school.Value) { if ($student.fullName -like "*JOHN DOE*") { $results += [PSCustomObject]@{ "Zone" = $zone.Name; "School" = $school.Name; "S/N" = $student.serialNumber; "Admission No." = $student.admissionNumber; "Sex" = $student.sex; "Feeder School" = $student.feederSchool } } } } }; if ($results.Count -eq 0) { Write-Host "❌ No student found matching that name criteria." -ForegroundColor Red } else { $results | Format-Table -AutoSize }


* How to change the name: Replace *JOHN DOE* inside the script with the name you want to look up. Keep the wildcards (*) on both ends so it finds partial name matches (e.g., searching *MARDIYYAH* will find ABDRASHEED AJOKE MARDIYYAH).

------------------------------
## Command 2: Search for a School Name
This command reads your database structure to tell you exactly which administrative zone a specific school belongs to, filtering out duplicate lookups.
Copy and paste this command into your Windows PowerShell window:

$json = Get-Content -Raw "src/admission/data/admission_datastream.json" | ConvertFrom-Json; $results = @(); foreach ($zone in $json.psobject.Properties) { foreach ($school in $zone.Value.psobject.Properties) { if ($school.Name -like "*SURULERE*") { $results += [PSCustomObject]@{ "Zone" = $zone.Name; "School Name" = $school.Name } } } }; if ($results.Count -eq 0) { Write-Host "❌ No school found matching that name criteria." -ForegroundColor Red } else { $results | Sort-Object Zone, "School Name" -Unique | Format-Table -AutoSize }


* How to change the school: Replace *SURULERE* inside the script with whatever keyword you are looking for (e.g., *AGEGE*, *HIGH*, *ISOLO*).

------------------------------
## Pro-Tip: Turn them into Permanent Shortcuts
If you don't want to copy and paste these long commands every time, you can save them as temporary helper variables during your terminal session.
Run this once in your open PowerShell window:

function Find-Student ($name) { $json = Get-Content -Raw "src/admission/data/admission_datastream.json" | ConvertFrom-Json; $res = @(); foreach ($z in $json.psobject.Properties) { foreach ($s in $z.Value.psobject.Properties) { foreach ($st in $s.Value) { if ($st.fullName -like "*$name*") { $res += [PSCustomObject]@{ "Zone"=$z.Name; "School"=$s.Name; "S/N"=$st.serialNumber; "Admission No."=$st.admissionNumber; "Sex"=$st.sex } } } } }; $res | Format-Table -AutoSize }

Now, for the rest of the day, you can search for anyone instantly by typing a single clean line:

Find-Student "MARDIYYAH"

