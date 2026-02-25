# Batch responsive fixes for remaining admin pages
$adminDir = "C:\Users\Balaji\OneDrive\Desktop\project-ecom\final_shopsphere\admin-service\src\admin"

# Files already done: AdminDashboard, OrderManagement, User, VendorApproval, ProductManagement, ReturnsManagement
# Files to update:
$files = @(
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

foreach ($file in $files) {
    $path = Join-Path $adminDir $file
    if (-not (Test-Path $path)) {
        Write-Host "SKIP (not found): $file"
        continue
    }

    $content = Get-Content $path -Raw

    # 1. Change useState(true) for isSidebarOpen to responsive default
    $content = $content -replace 'const \[isSidebarOpen, setIsSidebarOpen\] = useState\(true\);', 'const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);'

    # 2. Add Menu to lucide-react imports if not already there  
    if ($content -notmatch 'Menu[,\s]') {
        # Add Menu before the closing } from 'lucide-react'
        $content = $content -replace "(\s+\w+\s*\r?\n)(} from 'lucide-react';)", "`$1    Menu`n`$2"
    }

    # 3. Pass setIsSidebarOpen to Sidebar
    $content = $content -replace '<Sidebar isSidebarOpen=\{isSidebarOpen\} activePage=', '<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activePage='
    $content = $content -replace '<Sidebar\s+isSidebarOpen=\{isSidebarOpen\}\s+activePage=', '<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activePage='

    # 4. Replace header: px-8 h-20 -> responsive
    $content = $content -replace 'border-b px-8 h-20 flex items-center', 'border-b px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex items-center'

    # 5. Replace header gap-4 -> responsive
    $content = $content -replace '"flex items-center gap-4">\s*\r?\n\s*<button onClick=\{\(\) => setIsSidebarOpen', '"flex items-center gap-2 sm:gap-4">' + "`n" + '                        <button onClick={() => setIsSidebarOpen'

    # 6. Replace sidebar toggle button content (PanelLeftClose/PanelLeftOpen) with hamburger on mobile
    $oldToggle = '{isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}'
    $newToggle = @'
<span className="md:hidden"><Menu className="w-5 h-5" /></span>
                            <span className="hidden md:block">{isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}</span>
'@
    if ($content.Contains($oldToggle)) {
        $content = $content.Replace($oldToggle, $newToggle.Trim())
    }

    # 7. Make h1 title responsive
    $content = $content -replace 'className=\{`text-lg font-', 'className={`text-sm sm:text-base lg:text-lg font-'

    # 8. Hide subtitle on mobile
    $content = $content -replace 'className="text-\[10px\] text-slate-500 font-bold uppercase tracking-normal">', 'className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-normal hidden sm:block">'

    # 9. Make main content padding responsive
    $content = $content -replace 'className="flex-1 overflow-y-auto p-4 md:p-8">', 'className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">'
    $content = $content -replace 'className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">', 'className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-transparent">'

    # 10. Make stats grid responsive  
    $content = $content -replace 'className="grid grid-cols-1 md:grid-cols-4 gap-6">', 'className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">'
    $content = $content -replace 'className="grid grid-cols-1 md:grid-cols-3 gap-8">', 'className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">'

    # 11. Make search/filter toolbar responsive
    $content = $content -replace 'className=\{`p-4 rounded-\[2rem\] border transition-all duration-300 flex flex-col md:flex-row gap-4 items-center', 'className={`p-3 sm:p-4 rounded-2xl sm:rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center'

    # 12. Make header right section responsive  
    $content = $content -replace '"flex items-center gap-6">\s*\r?\n\s*<NotificationBell', '"flex items-center gap-2 sm:gap-4 lg:gap-6">' + "`n" + '                        <NotificationBell'

    # 13. Hide "hidden lg:" status badge on mobile
    $content = $content -replace 'className=\{`hidden lg:flex items-center border rounded-lg', 'className={`hidden xl:flex items-center border rounded-lg'

    # 14. Add resize effect if not present
    if ($content -notmatch 'handleResize') {
        $resizeEffect = @"

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setIsSidebarOpen(false);
            else if (window.innerWidth >= 1024) setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
"@
        # Insert after the first useEffect block
        $content = $content -replace '(useEffect\(\(\) => \{[^}]*\}[^;]*;\s*\r?\n\s*\}, \[\]\);)', "`$1`n$resizeEffect"
    }

    Set-Content -Path $path -Value $content -NoNewline
    Write-Host "UPDATED: $file"
}

Write-Host "`nAll files updated!"
