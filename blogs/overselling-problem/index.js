<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flash Sale & Race Condition — Tại sao hệ thống bán lố hàng và cách chống Overselling</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fff;
      color: #1a1a1a;
      line-height: 1.8;
    }

    nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
    }
    .nav-logo {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #1a1a1a;
      text-decoration: none;
    }
    .nav-tag {
      font-size: 13px;
      color: #6b6b6b;
      background: #f2f2f2;
      border-radius: 100px;
      padding: 4px 12px;
    }

    .hero {
      max-width: 740px;
      margin: 56px auto 0;
      padding: 0 24px;
    }
    .hero-tag {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #6b6b6b;
      margin-bottom: 20px;
    }
    h1 {
      font-size: clamp(24px, 4vw, 36px);
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -1px;
      color: #1a1a1a;
      margin-bottom: 20px;
    }
    .subtitle {
      font-size: 17px;
      color: #3d3d3d;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .meta {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
      margin-bottom: 48px;
      font-size: 13px;
      color: #6b6b6b;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }
    .meta-info { display: flex; flex-direction: column; gap: 2px; }
    .meta-author { font-weight: 600; color: #1a1a1a; }

    article {
      max-width: 740px;
      margin: 0 auto;
      padding: 0 24px 80px;
      font-size: 16px;
    }

    .lead {
      font-size: 17px;
      line-height: 1.7;
      border-left: 3px solid #1a1a1a;
      padding-left: 24px;
      margin-bottom: 48px;
      color: #2a2a2a;
    }

    h2 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 56px 0 16px;
      line-height: 1.3;
    }
    h3 {
      font-size: 17px;
      font-weight: 700;
      margin: 36px 0 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    h3 .badge {
      background: #1a1a1a;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      padding: 3px 9px;
      border-radius: 4px;
      white-space: nowrap;
    }

    p { margin-bottom: 24px; }

    .callout {
      border-radius: 8px;
      padding: 16px 20px;
      margin: 24px 0;
      font-size: 14px;
      line-height: 1.7;
    }
    .callout-danger {
      background: #fff5f5;
      border-left: 4px solid #e53e3e;
      color: #2d2d2d;
    }
    .callout-danger strong { color: #c53030; }
    .callout-info {
      background: #f7f7f7;
      border-left: 4px solid #1a1a1a;
      color: #2d2d2d;
    }
    .callout-tip {
      background: #f0fff4;
      border-left: 4px solid #38a169;
      color: #2d2d2d;
    }
    .callout-tip strong { color: #276749; }
    .callout-warn {
      background: #fffbeb;
      border-left: 4px solid #d97706;
      color: #2d2d2d;
    }
    .callout-warn strong { color: #92400e; }

    .steps {
      list-style: none;
      margin: 24px 0 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .steps li {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      font-size: 15px;
      line-height: 1.6;
    }
    .step-num {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #1a1a1a;
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1px;
    }
    .step-num.red { background: #e53e3e; }
    .steps li strong { color: #1a1a1a; }

    code {
      background: #f2f2f2;
      border-radius: 4px;
      padding: 2px 7px;
      font-family: 'Menlo', 'Consolas', monospace;
      font-size: 13px;
      color: #1a1a1a;
    }
    pre {
      background: #1a1a1a;
      color: #e8e8e8;
      border-radius: 8px;
      padding: 20px 24px;
      margin: 24px 0;
      overflow-x: auto;
      font-family: 'Menlo', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.7;
    }
    pre .cm  { color: #666; }
    pre .kw  { color: #c792ea; }
    pre .fn  { color: #82aaff; }
    pre .st  { color: #c3e88d; }
    pre .nu  { color: #f78c6c; }
    pre .bad { color: #fc8181; }
    pre .ok  { color: #68d391; }

    .flow {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 20px 0 28px;
      background: #f7f7f7;
      border-radius: 10px;
      padding: 14px 18px;
      font-size: 12px;
      font-weight: 500;
    }
    .flow-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .flow-label {
      font-size: 11px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .flow-box {
      background: #1a1a1a;
      color: #fff;
      padding: 5px 11px;
      border-radius: 5px;
      white-space: nowrap;
    }
    .flow-arrow { color: #bbb; font-size: 14px; }
    .flow-box.ghost { background: #e4e4e4; color: #444; }
    .flow-box.bad   { background: #e53e3e; }
    .flow-box.good  { background: #38a169; }
    .flow-box.warn  { background: #d97706; }
    .flow-box.highlight { background:#1a1a1a; outline: 2px dashed #888; outline-offset: 2px; }

    /* compare table */
    .compare {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      margin: 24px 0 32px;
    }
    .compare th {
      text-align: left;
      padding: 10px 14px;
      background: #1a1a1a;
      color: #fff;
      font-weight: 600;
    }
    .compare th:first-child { border-radius: 8px 0 0 0; }
    .compare th:last-child  { border-radius: 0 8px 0 0; }
    .compare td {
      padding: 10px 14px;
      border-bottom: 1px solid #e8e8e8;
      vertical-align: top;
      line-height: 1.6;
    }
    .compare tr:last-child td { border-bottom: none; }
    .compare tr:nth-child(even) td { background: #fafafa; }
    .yes { color: #276749; font-weight: 600; }
    .no  { color: #c53030; font-weight: 600; }
    .mid { color: #92400e; font-weight: 600; }

    hr {
      border: none;
      border-top: 1px solid #e8e8e8;
      margin: 56px 0;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 48px;
    }
    .tag {
      background: #f2f2f2;
      color: #444;
      font-size: 13px;
      padding: 6px 14px;
      border-radius: 100px;
    }

    @media (max-width: 600px) {
      h2 { font-size: 20px; }
      article { font-size: 15px; }
      .lead { font-size: 16px; }
      pre { font-size: 12px; padding: 14px 16px; }
    }
  </style>
</head>
<body>

<nav>
  <a class="nav-logo" href="index.html">As you know</a>
  <span class="nav-tag">Backend · Concurrency</span>
</nav>

<header class="hero">
  <p class="hero-tag">Flash Sale · Race Condition · Inventory</p>
  <h1>Overselling — Tại sao hệ thống bán lố hàng và 4 lớp phòng thủ để chống lại</h1>
  <p class="subtitle">Kho có 100 chiếc iPhone, 1 triệu người nhấn "Mua ngay" cùng lúc — hệ thống sẽ bán được bao nhiêu? Câu trả lời sẽ khiến bạn giật mình.</p>
  <div class="meta">
    <div class="avatar">T</div>
    <div class="meta-info">
      <span class="meta-author">Thong Nguyen</span>
      <span>24 tháng 3, 2026</span>
    </div>
  </div>
</header>

<article>

  <p class="lead">
    <strong>Race Condition</strong> (hay <strong>Overselling</strong> trong ngữ cảnh bán hàng) xảy ra khi nhiều tiến trình cùng đọc một giá trị, cùng thấy điều kiện thoả mãn, và cùng ghi kết quả — không ai biết ai. Hậu quả: kho âm hàng nghìn chiếc, công ty đền tiền, senior mất việc.
  </p>

  <!-- ═══════════ VẤN ĐỀ ══ -->
  <h2>Tại sao Race Condition xảy ra?</h2>

  <p>Hãy hình dung kho còn đúng 1 chiếc. Hai user A và B nhấn "Mua ngay" cùng lúc. Đây là thứ xảy ra bên trong hệ thống Junior:</p>

  <div class="flow">
    <div class="flow-label">Thread A (User A)</div>
    <div class="flow-row">
      <div class="flow-box ghost">SELECT stock = 1</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box ghost">if (1 > 0) ✓</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box bad">UPDATE stock = 0</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box good">Tạo đơn hàng ✓</div>
    </div>
    <div class="flow-label" style="margin-top:8px;">Thread B (User B) — chạy gần như đồng thời</div>
    <div class="flow-row">
      <div class="flow-box ghost">SELECT stock = 1</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box ghost">if (1 > 0) ✓</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box bad">UPDATE stock = 0</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box good">Tạo đơn hàng ✓</div>
    </div>
  </div>

  <p>Cả hai thread đều đọc được <code>stock = 1</code> trước khi ai kịp ghi. Cả hai đều thấy điều kiện thoả mãn. Cả hai đều tạo đơn hàng thành công. Kết quả: 1 chiếc được bán cho 2 người.</p>

  <div class="callout callout-danger">
    <strong>❌ Khi Flash Sale với 1 triệu người:</strong> Hàng nghìn request có thể cùng đọc <code>stock = 100</code> trong cùng một mili-giây. Tất cả đều thấy điều kiện thoả mãn, tất cả đều tạo đơn. Database nhận hàng nghìn lệnh UPDATE trừ dần — và cuối cùng stock có thể xuống <strong>-4,000, -10,000</strong>. Công ty phải bồi thường toàn bộ.
  </div>

  <hr />

  <!-- ═══════════ GIẢI PHÁP 1 ══ -->
  <h2>Giải pháp 1 — Pessimistic Locking (Khoá bi quan)</h2>
  <p style="margin-top:-8px; color:#6b6b6b; font-size:14px;">Cấp độ: Database · Dễ implement · Phù hợp lượng traffic vừa phải</p>

  <p>Tư duy: <em>"Tôi không tin ai cả. Tôi sẽ khoá dòng này lại trước khi đọc, không ai được chạm vào cho đến khi tôi xử lý xong."</em></p>

  <pre><span class="cm">-- Bắt đầu transaction</span>
<span class="fn">BEGIN</span>;

<span class="cm">-- SELECT FOR UPDATE: khoá dòng này lại ngay lập tức</span>
<span class="cm">-- Thread B gọi cùng lúc sẽ bị CHẶN lại đây cho đến khi A COMMIT</span>
<span class="fn">SELECT</span> stock <span class="fn">FROM</span> products
<span class="fn">WHERE</span> id = <span class="nu">1</span>
<span class="fn">FOR UPDATE</span>;

<span class="cm">-- Kiểm tra và trừ kho (chỉ 1 thread được chạy đến đây tại một thời điểm)</span>
<span class="fn">UPDATE</span> products
<span class="fn">SET</span> stock = stock - <span class="nu">1</span>
<span class="fn">WHERE</span> id = <span class="nu">1</span> <span class="fn">AND</span> stock > <span class="nu">0</span>;

<span class="cm">-- Kiểm tra rows affected: nếu = 0 thì hết hàng</span>
<span class="fn">COMMIT</span>;</pre>

  <div class="callout callout-info">
    <strong>Cơ chế:</strong> <code>SELECT FOR UPDATE</code> yêu cầu database đặt một <strong>row-level lock</strong> lên dòng đó. Thread B cố đọc cùng dòng sẽ bị block và phải chờ. Khi A COMMIT, lock được giải phóng, B mới tiếp tục — lúc này B đọc được stock đã được trừ bởi A.
  </div>

  <div class="callout callout-warn">
    <strong>⚠️ Nhược điểm:</strong> Với 1 triệu request cùng lúc, 999,999 thread còn lại đều bị block và xếp hàng chờ. Thời gian chờ tích luỹ, connection pool của DB cạn kiệt, server timeout hàng loạt. <strong>Pessimistic Locking chỉ phù hợp khi traffic vừa phải</strong> (vài nghìn concurrent users), không phải Flash Sale triệu người.
  </div>

  <hr />

  <!-- ═══════════ GIẢI PHÁP 2 ══ -->
  <h2>Giải pháp 2 — Optimistic Locking (Khoá lạc quan)</h2>
  <p style="margin-top:-8px; color:#6b6b6b; font-size:14px;">Cấp độ: Database · Không block · Phù hợp khi xung đột ít xảy ra</p>

  <p>Tư duy: <em>"Tôi tin mọi người và cứ thao tác bình thường. Nhưng khi ghi, tôi sẽ kiểm tra xem có ai đã thay đổi dữ liệu trước tôi không. Nếu có — thất bại, thử lại."</em></p>

  <pre><span class="cm">-- Thêm cột version vào bảng (chỉ làm 1 lần)</span>
<span class="fn">ALTER TABLE</span> products <span class="fn">ADD COLUMN</span> version <span class="fn">INT DEFAULT</span> <span class="nu">0</span>;

<span class="cm">-- Đọc dữ liệu kèm version hiện tại</span>
<span class="fn">SELECT</span> stock, version <span class="fn">FROM</span> products <span class="fn">WHERE</span> id = <span class="nu">1</span>;
<span class="cm">-- → stock = 100, version = 42</span>

<span class="cm">-- Khi update, kiểm tra version phải khớp</span>
<span class="fn">UPDATE</span> products
<span class="fn">SET</span>
  stock   = stock - <span class="nu">1</span>,
  version = version + <span class="nu">1</span>          <span class="cm">-- tăng version lên</span>
<span class="fn">WHERE</span> id      = <span class="nu">1</span>
  <span class="fn">AND</span> version = <span class="nu">42</span>               <span class="cm">-- ← điều kiện then chốt</span>
  <span class="fn">AND</span> stock   > <span class="nu">0</span>;

<span class="cm">-- Nếu rows_affected = 0: ai đó đã update trước → version đổi → thử lại</span>
<span class="cm">-- Nếu rows_affected = 1: thành công!</span></pre>

  <div class="callout callout-tip">
    <strong>✅ Tại sao an toàn?</strong> Dù hai thread cùng đọc <code>version = 42</code>, chỉ một thread đầu tiên UPDATE thành công và đổi version thành 43. Thread thứ hai UPDATE với điều kiện <code>version = 42</code> sẽ không khớp dòng nào (<code>rows_affected = 0</code>) — biết bị "vượt mặt" và thử lại hoặc báo lỗi.
  </div>

  <div class="callout callout-warn">
    <strong>⚠️ Nhược điểm:</strong> Trong Flash Sale, hầu hết requests sẽ fail và phải retry liên tục — tạo ra <strong>Thundering Herd</strong> (bầy thú điên): tất cả cùng retry đồng loạt, cùng fail, cùng retry lại... DB vẫn bị quá tải dù không bị Overselling. Optimistic Locking hiệu quả khi <strong>xung đột hiếm xảy ra</strong> (không phải Flash Sale).
  </div>

  <hr />

  <!-- ═══════════ GIẢI PHÁP 3 ══ -->
  <h2>Giải pháp 3 — Redis Atomic Operation (Chuẩn công nghiệp)</h2>
  <p style="margin-top:-8px; color:#6b6b6b; font-size:14px;">Cấp độ: Redis · Siêu nhanh · Dành cho Flash Sale thực sự</p>

  <p>Tư duy: <em>"Đừng để DB phải gánh trận chiến đó. Đưa cuộc chiến tồn kho lên RAM — nơi mọi thứ diễn ra nhanh gấp 100 lần và atomic theo thiết kế."</em></p>

  <div class="flow">
    <div class="flow-label">Luồng Flash Sale với Redis</div>
    <div class="flow-row">
      <div class="flow-box ghost">1M request đến</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box highlight">Redis Lua Script (atomic)</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box good">100 người thành công</div>
    </div>
    <div class="flow-row">
      <div class="flow-box good">100 message vào Queue</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box ghost">Worker nhặt từng message</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box ghost">DB cập nhật từ từ</div>
    </div>
  </div>

  <pre><span class="cm">-- Bước 1: Khởi tạo tồn kho trên Redis khi Flash Sale bắt đầu</span>
SET flash_sale:product:1:stock <span class="nu">100</span>

<span class="cm">-- Bước 2: Lua Script chạy atomic (không thể bị interrupt giữa chừng)</span>
<span class="cm">-- 1 triệu request gọi script này, Redis xử lý tuần tự, siêu nhanh trong RAM</span>
local stock = <span class="fn">redis.call</span>(<span class="st">'GET'</span>, KEYS[<span class="nu">1</span>])
<span class="kw">if</span> tonumber(stock) > <span class="nu">0</span> <span class="kw">then</span>
  <span class="fn">redis.call</span>(<span class="st">'DECR'</span>, KEYS[<span class="nu">1</span>])  <span class="cm">-- trừ 1 (atomic)</span>
  <span class="kw">return</span> <span class="nu">1</span>                       <span class="cm">-- thành công → cho đặt hàng</span>
<span class="kw">else</span>
  <span class="kw">return</span> <span class="nu">0</span>                       <span class="cm">-- hết hàng → từ chối ngay</span>
<span class="kw">end</span></pre>

  <div class="callout callout-info">
    <strong>Tại sao Lua Script là atomic?</strong> Redis là single-threaded. Khi một Lua script đang chạy, toàn bộ Redis server không xử lý bất kỳ lệnh nào khác — script chạy xong xuôi rồi mới nhận lệnh tiếp theo. Đây là <strong>hardware-level atomicity</strong>: không có cách nào để 2 script chen chân vào giữa nhau. Đây cũng là lý do Redis dùng single thread thay vì multi-thread.
  </div>

  <pre><span class="cm">-- Bước 3: Nếu Redis trả về 1 (thành công) → đẩy vào Message Queue</span>
<span class="cm">-- Worker nhặt message và cập nhật DB từ từ, không bao giờ quá tải</span>
<span class="fn">LPUSH</span> orders:queue <span class="st">'{"user_id": 123, "product_id": 1, "quantity": 1}'</span>

<span class="cm">-- Bước 4: Worker (chạy riêng biệt) xử lý từng đơn hàng</span>
<span class="kw">LOOP</span>:
  message = <span class="fn">BRPOP</span> orders:queue  <span class="cm">-- blocking pop, không tốn CPU khi rỗng</span>
  <span class="fn">BEGIN TRANSACTION</span>
    <span class="fn">INSERT INTO</span> orders (...)
    <span class="fn">UPDATE</span> products <span class="fn">SET</span> stock = stock - <span class="nu">1</span> <span class="fn">WHERE</span> id = <span class="nu">1</span>
  <span class="fn">COMMIT</span></pre>

  <div class="callout callout-tip">
    <strong>✅ Kết quả:</strong> Redis xử lý 1 triệu request trong vài giây, chỉ 100 người thắng, 999,900 người nhận thông báo "Hết hàng" ngay lập tức. DB chỉ nhận đúng 100 lệnh INSERT từ worker — không bao giờ quá tải, không bao giờ Overselling.
  </div>

  <hr />

  <!-- ═══════════ GIẢI PHÁP 4 ══ -->
  <h2>Giải pháp 4 — Waiting Room (Phòng chờ ảo)</h2>
  <p style="margin-top:-8px; color:#6b6b6b; font-size:14px;">Bổ sung · UX tốt · Shopee, Lazada, Ticketmaster dùng</p>

  <p>Thay vì để 1 triệu request đồng thời đập vào server, ta xây một "phòng chờ" bên ngoài — chỉ cho vào một số lượng nhất định mỗi giây.</p>

  <div class="flow">
    <div class="flow-label">Kiến trúc Waiting Room</div>
    <div class="flow-row">
      <div class="flow-box ghost">1M user truy cập</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box warn">Queue / Waiting Room</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box">Nhỏ giọt vào hệ thống</div>
      <div class="flow-arrow">→</div>
      <div class="flow-box good">Redis + DB xử lý nhẹ nhàng</div>
    </div>
  </div>

  <ol class="steps">
    <li>
      <span class="step-num">1</span>
      <span><strong>Vào phòng chờ:</strong> User nhấn "Mua ngay" → được cấp một <strong>ticket number</strong> và thấy màn hình "Bạn đang ở hàng thứ 50,000. Ước tính 3 phút". Hệ thống thực tế chưa nhận request gì cả.</span>
    </li>
    <li>
      <span class="step-num">2</span>
      <span><strong>Nhỏ giọt:</strong> Mỗi giây, hệ thống cho phép N user tiếp theo vào (ví dụ 500/giây). User nhận thông báo "Đến lượt bạn!" và được redirect vào trang mua hàng thật.</span>
    </li>
    <li>
      <span class="step-num">3</span>
      <span><strong>Hết hàng mid-queue:</strong> Khi 100 người đã mua thành công, những người còn trong queue nhận thông báo "Rất tiếc, hết hàng" — không cần vào đến hệ thống.</span>
    </li>
  </ol>

  <div class="callout callout-info">
    <strong>Công cụ:</strong> Cloudflare Waiting Room (SaaS, không cần code), hoặc tự build với Redis Sorted Set (dùng timestamp làm score để xếp hàng đúng thứ tự) + WebSocket để push thông báo "Đến lượt bạn" real-time. Ticketmaster và Shopee dùng cơ chế tương tự cho các sự kiện lớn.
  </div>

  <hr />

  <!-- ═══════════ BỔ SUNG ══ -->
  <h2>Bổ sung — Idempotency & Database Constraint</h2>

  <h3><span class="badge">Bổ sung 1</span> Idempotency Key — Chống mua trùng khi retry</h3>

  <p>Vấn đề ít người nghĩ đến: user nhấn "Mua ngay" 3 lần vì trang load chậm, hoặc network retry tự động gửi request 2 lần. Kết quả: 3 đơn hàng được tạo cho 1 lần mua — một dạng Overselling khác.</p>

  <pre><span class="cm">-- Client tạo một ID ngẫu nhiên duy nhất cho mỗi lần mua</span>
<span class="cm">-- Gửi kèm trong header mỗi request</span>
POST /orders
Idempotency-Key: <span class="st">"a1b2c3d4-e5f6-7890-abcd-ef1234567890"</span>

<span class="cm">-- Server kiểm tra key này đã xử lý chưa</span>
<span class="fn">SET</span> idempotency:<span class="st">"a1b2c3d4..."</span> <span class="st">"processing"</span> <span class="fn">NX EX</span> <span class="nu">300</span>
<span class="cm">-- NX = chỉ set nếu chưa tồn tại → nếu key đã tồn tại = request trùng</span>
<span class="cm">-- EX 300 = tự xoá sau 5 phút</span>

<span class="cm">-- Nếu key đã tồn tại: trả về kết quả của lần đầu tiên (không xử lý lại)</span>
<span class="cm">-- Nếu key chưa tồn tại: xử lý bình thường, lưu kết quả vào key đó</span></pre>

  <div class="callout callout-info">
    <strong>Stripe, PayPal đều dùng Idempotency Key</strong> cho tất cả API ghi. Đây là pattern bắt buộc khi thiết kế payment system — đảm bảo dù network fail và client retry 10 lần, chỉ đúng 1 giao dịch được tạo.
  </div>

  <h3><span class="badge">Bổ sung 2</span> Database CHECK Constraint — Lớp phòng thủ cuối cùng</h3>

  <p>Dù bạn đã làm mọi thứ đúng ở tầng ứng dụng, hãy luôn có một lớp bảo vệ terakhir ở tầng Database — vì code có bug, có edge case không ai lường trước.</p>

  <pre><span class="cm">-- Ràng buộc cứng: stock không bao giờ được âm</span>
<span class="fn">ALTER TABLE</span> products
  <span class="fn">ADD CONSTRAINT</span> chk_stock_non_negative
  <span class="fn">CHECK</span> (stock >= <span class="nu">0</span>);

<span class="cm">-- Nếu bất kỳ UPDATE nào cố trừ xuống âm → DB throw exception ngay lập tức</span>
<span class="cm">-- Giao dịch bị rollback tự động — không bao giờ có stock âm trong DB</span></pre>

  <div class="callout callout-tip">
    <strong>✅ Defense in depth:</strong> CHECK Constraint không thay thế các giải pháp trên, nhưng là lưới an toàn cuối cùng. Dù tầng Redis bị bug, dù worker xử lý sai — DB sẽ từ chối commit và raise error thay vì âm thầm ghi stock âm vào bảng.
  </div>

  <hr />

  <!-- ═══════════ SO SÁNH ══ -->
  <h2>So sánh các giải pháp</h2>

  <table class="compare">
    <thead>
      <tr>
        <th>Giải pháp</th>
        <th>Chống Overselling</th>
        <th>Chịu tải cao</th>
        <th>Độ phức tạp</th>
        <th>Phù hợp với</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>SELECT + kiểm tra ở code</strong></td>
        <td class="no">Không</td>
        <td class="yes">Tốt</td>
        <td class="yes">Thấp</td>
        <td>Không bao giờ dùng cho concurrency</td>
      </tr>
      <tr>
        <td><strong>Pessimistic Lock</strong> (FOR UPDATE)</td>
        <td class="yes">Có</td>
        <td class="no">Kém</td>
        <td class="yes">Thấp</td>
        <td>Traffic thấp, không cần scale</td>
      </tr>
      <tr>
        <td><strong>Optimistic Lock</strong> (version)</td>
        <td class="yes">Có</td>
        <td class="mid">Trung bình</td>
        <td class="mid">Trung bình</td>
        <td>Xung đột hiếm, traffic vừa phải</td>
      </tr>
      <tr>
        <td><strong>Redis Lua + Queue</strong></td>
        <td class="yes">Có</td>
        <td class="yes">Rất tốt</td>
        <td class="no">Cao</td>
        <td>Flash Sale, hàng triệu concurrent users</td>
      </tr>
      <tr>
        <td><strong>Waiting Room</strong></td>
        <td class="yes">Có</td>
        <td class="yes">Rất tốt</td>
        <td class="no">Cao</td>
        <td>Flash Sale + UX tốt, kết hợp Redis</td>
      </tr>
    </tbody>
  </table>

  <p>Hệ thống production-grade cho Flash Sale thường kết hợp: <strong>Waiting Room</strong> để kiểm soát lượng vào → <strong>Redis Lua Script</strong> để quyết định ai được mua → <strong>Message Queue</strong> để DB cập nhật từ từ → <strong>Idempotency Key</strong> để chống retry trùng → <strong>CHECK Constraint</strong> làm lưới an toàn cuối cùng. Mỗi lớp bảo vệ một loại lỗi khác nhau.</p>

  <div class="tags">
    <span class="tag">Flash Sale</span>
    <span class="tag">Race Condition</span>
    <span class="tag">Overselling</span>
    <span class="tag">Redis</span>
    <span class="tag">Pessimistic Lock</span>
    <span class="tag">Optimistic Lock</span>
    <span class="tag">Idempotency</span>
    <span class="tag">Concurrency</span>
    <span class="tag">System Design</span>
  </div>

</article>

<script src="../../sidebar.js"></script>
</body>
</html>
