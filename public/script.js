searchForm =document.querySelector('.search-form');
document.querySelector('#search_btn').onclick=()=>{
    searchForm.classList.toggle('active');

}
let loginForm = document.querySelector('.login-form-container');
document.querySelector('#login-btn').onclick=()=>{
    searchForm.classList.toggle('active');

}
window.onscroll =() =>{
    searchForm.classList.remove('active');}
window.onscroll =() =>{
    if(window.scrollY> 80){
        document.querySelector('.header .header-2').classList.add('active');
        }else{
            document.querySelector('.header .header-2').classList.remove('active');
    }
}


