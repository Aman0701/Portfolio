
const expandable = document.querySelectorAll('.expandable');

expandable.forEach(exp => {
    exp.addEventListener('click', () => {
        const div = exp.querySelector('.list');
        const dropdown = exp.querySelector('#dropdown');
        const dropup = exp.querySelector('#dropup');
        exp.classList.toggle('expended');
        div.classList.toggle('display-none');
        dropdown.classList.toggle('display-none');
        dropup.classList.toggle('display-none');
        const button = exp.querySelector('.update-link');
        button.addEventListener('click',(e)=>{
            e.preventDefault();
            const div = document.getElementById('subscribe');
            div.style.display = 'block'
              
            const price = button.getAttribute('data-price');
            const sub = button.getAttribute('data-sub'); 
            document.getElementById('price').value = price;
            document.getElementById('priceValue').innerHTML = `@  <i class="fa-solid fa-indian-rupee-sign"></i>  ${price}`;
            document.getElementById('subscriptionType').textContent = `${sub} Subscription`;
        });

        const cancle = document.getElementById('cancle');
        cancle.addEventListener('click',()=>{
            const div = document.getElementById('subscribe');
            div.style.display = 'none'
        })
    });
});
