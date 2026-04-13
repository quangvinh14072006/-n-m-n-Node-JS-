const tabs = document.querySelectorAll('.tab-login-item');
const forms = document.querySelectorAll('.form-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 1. Xóa class active của tab cũ, thêm vào tab vừa click
        document.querySelector('.tab-login-item.active').classList.remove('active');
        tab.classList.add('active');

        // 2. Ẩn tất cả các form
        forms.forEach(form => form.classList.add('d-none'));

        // 3. Hiển thị form tương ứng dựa trên data-type
        const type = tab.getAttribute('data-type');
        document.getElementById(`${type}-content`).classList.remove('d-none');
    });
});
