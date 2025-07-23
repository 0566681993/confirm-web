
const supabaseUrl = 'https://rtxdvcvzkepogytpnvsi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eGR2Y3Z6a2Vwb2d5dHBudnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzI1NzksImV4cCI6MjA2ODg0ODU3OX0.SG_q8rnfAA7LAFoYYQyPsUFZPqsh1C13GbkGln4Z3JU';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

async function submitRequest() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const deviceId = getDeviceId();
  const messageDiv = document.getElementById("message");
  messageDiv.innerHTML = "";

  if (!name || !email) {
    messageDiv.innerHTML = "<p class='error'>Vui lòng nhập đầy đủ thông tin.</p>";
    return;
  }

  // Kiểm tra đã được duyệt chưa
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("Email", email)
    .eq("Devices", deviceId)
    .eq("Approval", true);

  if (error) {
    messageDiv.innerHTML = "<p class='error'>Lỗi kết nối dữ liệu.</p>";
    return;
  }

  if (data.length > 0) {
    messageDiv.innerHTML = "<p class='success'>✅ Truy cập được chấp thuận.</p>";
    return;
  }

  // Nếu chưa duyệt → gửi yêu cầu
  await supabase.from("User").insert([{
    Email: email,
    Devices: deviceId,
    Approval: false
  }]);

  messageDiv.innerHTML = "<p>⏳ Yêu cầu đã được gửi. Vui lòng chờ admin duyệt.</p>";
}
