$replacements = @{
    '$lib/types/' = '$lib/domain/types/';
    '$lib/components/shared/' = '$lib/components/ui/';
    '$lib/components/institucion/' = '$lib/components/feature/institucion/';
    '$lib/components/proyectos/' = '$lib/components/feature/proyectos/';
    '$lib/components/landing/' = '$lib/components/feature/home/'
}

$files = Get-ChildItem -Path "src" -Recurse -File -Include "*.svelte","*.ts","*.js"
foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        if ($content) {
            $originalContent = $content
            foreach ($key in $replacements.Keys) {
                # Use literal string replacement to avoid regex issues
                $content = $content.Replace($key, $replacements[$key])
            }
            if ($content -ne $originalContent) {
                Write-Host "Updating $($file.FullName)"
                $content | Set-Content $file.FullName -NoNewline -Encoding UTF8
            }
        }
    } catch {
        Write-Error "Failed to process $($file.FullName): $_"
    }
}
