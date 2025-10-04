<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asa dashboard</title>

    <!-- Vue Select -->
    <link rel="stylesheet" href="https://unpkg.com/vue-select@3.11.2/dist/vue-select.css">

    <!-- iziToast -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <link rel="stylesheet" href="./libs/iziToast/index.css">

    <style>
        /*------------------------------------------Vue custom ZONE-----------------------------------------------*/
        [v-cloak] {
            display: none;
        }
        /*------------------------------------------End - Vue custom ZONE-----------------------------------------------*/


        /*------------------------------------------FONT ZONE-----------------------------------------------*/
        @font-face {
            font-family: LCVUSHello;
            src: url("https://hcm03.vstorage.vngcloud.vn/v1/AUTH_0f4fc1cb9192411da4f5ef9ef7553ea3/Public_files/Dev_resource/FONTS/LC-VUS%20Hello.otf");
        }

        @font-face {
            font-family: LCVUSPro;
            src: url("https://hcm03.vstorage.vngcloud.vn/v1/AUTH_0f4fc1cb9192411da4f5ef9ef7553ea3/Public_files/Dev_resource/FONTS/LC-VUS%20Pro-Regular.otf");
        }

        .fontLCVUSHello {
            font-family: LCVUSHello;
            font-weight: 400 !important;
        }

        .fontLCVUSHello {
            font-family: LCVUSPro;
        }

        body {
            font-family: Segoe UI, Segoe WP, Arial, Sans-Serif;
        }
        /*------------------------------------------END FONT ZONE-----------------------------------------------*/


        /* -----------------------------------------------VUE-SELECT------------------------------------------------ */
        /* --- Đảm bảo component co giãn đúng trong grid --- */
        .custom-v-select {
            width: 100%;
        }

            /* Class tùy chỉnh để bọc component v-select */
            .custom-v-select .vs__dropdown-toggle {
                /* Reset và định dạng lại khung chính */
                background-color: white;
                border: 1px solid #ffffff; /* border-blue-200, sẽ bị ghi đè bởi focus/error */
                border-radius: 0.375rem; /* rounded-md */
                height: 38px; /* Chiều cao đồng bộ với input có py-2 text-sm */
                padding: 0; /* Reset padding của thư viện */
            }

            /* Căn chỉnh lại khu vực chứa chữ và input search */
            .custom-v-select .vs__selected-options {
                padding: 0.5rem 2.5rem 0.5rem 0.75rem; /* py-2, pr-10, pl-3 */
                overflow: hidden;
            }

            /* Style cho chữ đã được chọn */
            .custom-v-select .vs__selected {
                margin: 0;
                padding: 0;
                color: #111827; /* text-gray-900 */
                font-size: 0.875rem; /* text-sm */
                font-weight: 500; /* font-medium */
                line-height: 1.5; /* Căn chữ vào giữa theo chiều dọc */
                /* --- THÊM MỚI: Chống tràn chữ --- */
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                /* ------------------------------ */
            }

            /* Style cho placeholder và input khi gõ */
            .custom-v-select .vs__search,
            .custom-v-select .vs__search::placeholder {
                margin: 0;
                padding: 0;
                font-size: 0.875rem;
                color: #6b7280; /* text-gray-500 */
                background: transparent;
            }

            /* Ẩn nút xóa (x) và mũi tên mặc định của thư viện */
            .custom-v-select .vs__clear,
            .custom-v-select .vs__open-indicator {
                display: none;
            }

            /* Thêm mũi tên dropdown tùy chỉnh giống hệt select thường */
            .custom-v-select .vs__dropdown-toggle {
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                background-position: right 0.5rem center;
                background-repeat: no-repeat;
                background-size: 1.5em 1.5em;
            }

            /* Style cho trạng thái lỗi và focus (giữ nguyên) */
            .custom-v-select.has-error .vs__dropdown-toggle {
                border-color: #ef4444; /* red-500 */
            }

            .custom-v-select.vs--open .vs__dropdown-toggle {
                border-color: #3b82f6; /* blue-500 */
                box-shadow: 0 0 0 1px #3b82f6;
            }

            .custom-v-select.bg-gray-100 .vs__dropdown-toggle {
                background-color: #f3f4f6; /* gray-100 */
            }
        /* -----------------------------------------------END VUE-SELECT------------------------------------------------ */
    </style>
</head>

<body>
    <div id="app" v-cloak>
        <main-layout></main-layout>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="https://unpkg.com/vue@2/dist/vue.js"></script>
    <script src="https://unpkg.com/vue-router@3.6.5/dist/vue-router.js"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
    
    <!-- jQuery CDN -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

    <!-- Charts -->
    // <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js"></script>
    // <script src="https://cdn.jsdelivr.net/npm/vue-chartjs@3.5.1/dist/vue-chartjs.min.js"></script>

    <!-- Vue Select -->
    // <script src="https://unpkg.com/vue-select@3.11.2"></script>

    <!-- iziToast -->
    // <script src="./libs/iziToast/index.js"></script>

    <!-- App -->
    // <script src="v1/utils/XrmHelper.js"></script>
    // <script src="v1/utils/ToastCustom.js"></script>
    // <script src="../../lib/VusShared.js"></script>
    
    // <script src="v1/services/stats/SaleAfterCareService.js"></script>
    // <script src="v1/services/stats/CRCMService.js"></script>

    <!-- Template -->
    // <script src="v1/components/charts/BarChart.js"></script>
    // <script src="v1/components/charts/DoughnutChart.js"></script>
    // <script src="v1/components/charts/LineChart.js"></script>
    // <script src="v1/components/charts/CustomLineChart.js"></script>
    // <script src="v1/components/charts/PieChart.js"></script>
    // <script src="v1/components/charts/RadarChart.js"></script>
    
    <!-- Base -->
    // <script src="v1/components/DynamicIcon.js"></script>
    // <script src="v1/components/ui-base/SidebarMenu.js"></script>
    // <script src="v1/components/ui-base/HeaderMenu.js"></script>

    <!-- Pages -->
    // <script src="v1/components/pages/Overview.js"></script>
    // <script src="v1/components/pages/stats/SaleAfterCare.js"></script>
    // <script src="v1/components/pages/stats/CRCM.js"></script>
    // <script src="v1/components/pages/Test.js"></script>
    // <script src="v1/menuConfig.js"></script>

    // <script src="v1/components/MainLayout.js"></script>
    // <script src="v1/router.js"></script>
    // <script src="v1/app.js"></script>
</body>

</html>
