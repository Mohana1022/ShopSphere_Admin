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

$base = "C:\Users\Balaji\OneDrive\Desktop\project-ecom\final_shopsphere\admin-service\src\admin"

foreach ($f in $files) {
    $p = Join-Path $base $f
    if (Test-Path $p) {
        $c = Get-Content $p -Raw
        $hasMenu = $c.Contains("Menu,")
        $hasResize = $c.Contains("handleResize")
        $hasSidebarProp = $c.Contains("setIsSidebarOpen={setIsSidebarOpen}")
        $hasResponsiveHeader = $c.Contains("h-14 sm:h-16")
        Write-Host "$f => Menu=$hasMenu Resize=$hasResize SidebarProp=$hasSidebarProp ResponsiveHeader=$hasResponsiveHeader"
    } else {
        Write-Host "$f => NOT FOUND"
    }
}
