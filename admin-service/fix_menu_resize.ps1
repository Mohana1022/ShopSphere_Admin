# Fix missing Menu imports and handleResize in remaining admin pages
$adminDir = "C:\Users\Balaji\OneDrive\Desktop\project-ecom\final_shopsphere\admin-service\src\admin"

$filesToFix = @(
    "CommissionSettings.jsx",
    "DeletionRequests.jsx",
    "DeliveryList.jsx",
    "DeliveryRequests.jsx",
    "DeliveryReview.jsx",
    "OrderDetail.jsx",
    "Reports.jsx",
    "ReturnDetail.jsx",
    "VendorDetails.jsx",
    "VendorList.jsx",
    "VendorRequests.jsx",
    "VendorReview.jsx"
)

foreach ($file in $filesToFix) {
    $path = Join-Path $adminDir $file
    if (-not (Test-Path $path)) {
        Write-Host "SKIP: $file"
        continue
    }

    $content = Get-Content $path -Raw
    $changed = $false

    # Check if Menu import is missing (look for 'Menu,' or 'Menu' in import block)
    if (-not ($content -match '\bMenu\b')) {
        # This shouldn't happen since the template replacement uses <Menu
        Write-Host "NO MENU USAGE: $file"
    }
    
    # Add Menu to import if it uses <Menu but doesn't import it
    if (($content.Contains('<Menu ')) -and (-not ($content.Contains('    Menu,') -or $content.Contains('    Menu')))) {
        # Add Menu before PanelLeftClose
        if ($content.Contains('    PanelLeftClose,')) {
            $content = $content.Replace('    PanelLeftClose,', "    Menu,`r`n    PanelLeftClose,")
            $changed = $true
            Write-Host "  Added Menu import to: $file"
        }
    }

    # Add handleResize useEffect if missing
    if (-not $content.Contains('handleResize')) {
        $resizeBlock = @"

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setIsSidebarOpen(false);
            else if (window.innerWidth >= 1024) setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
"@
        # Find the pattern: first useEffect closing }, []);
        # We'll insert after the line containing isSidebarOpen useState
        if ($content.Contains('window.innerWidth >= 1024')) {
            # Already has responsive init, just need resize listener
            # Insert after first }, []);
            $idx = $content.IndexOf('}, []);')
            if ($idx -gt 0) {
                $insertPoint = $idx + '}, []);'.Length
                $content = $content.Insert($insertPoint, "`r`n$resizeBlock")
                $changed = $true
                Write-Host "  Added handleResize to: $file"
            }
        }
    }

    if ($changed) {
        Set-Content -Path $path -Value $content -NoNewline
        Write-Host "SAVED: $file"
    } else {
        Write-Host "OK (no changes needed): $file"
    }
}

Write-Host "`nDone!"
