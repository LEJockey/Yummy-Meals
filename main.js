//Making Loading till data be ready to display & Calling Meals Api & Closing sidebar
let navContentWidth = $('.nav-content').outerWidth();  
    let mealData = document.getElementById('mealData')
    getMeals()
    $(function () {
        $('.spinner').fadeOut(1000, function () {
            $('.loading').fadeOut(1000, function () {
                $('html, body').css('overflow', 'auto', function () {
                    $('.loading').remove()
                })
            })
        })
        $('.side-nav-menu').css('left', -navContentWidth) 
});



    // Button of Sidebar
    $('.toggleBtn').click(function () { 
        if ( $('.side-nav-menu').css('left') === '0px') {
            closeSideNav()
        }else openSideNav()
        
    });

    //Open Sidebar Function
    function openSideNav() {
        $('.side-nav-menu').animate({left:0}, 500)
        for (let i = 0; i < 5; i++) {
            $(".links li").eq(i).animate({top: 0 }, (i + 5) * 100)
        }
        $('.toggleBtn .bar1').css('transform', 'rotate(135deg) translate(8px, -7px)').css('transition-delay', '.1s')
        $('.toggleBtn .bar3').css('transform', 'rotate(222deg) translate(10px, 9px)').css('transition-delay', '.1s')
        $('.toggleBtn .bar2').css('opacity', '0')
    }

    //Close Sidebar Function 
    function closeSideNav() {
        $('.side-nav-menu').animate({left: -navContentWidth}, 500)
        $('.links li').animate({top:'300px'}, 500)
        $('.toggleBtn .bar1').css('transform', 'rotate(0deg) translate(0px, 0px)').css('transition-delay', '.1s')
        $('.toggleBtn .bar3').css('transform', 'rotate(0deg) translate(0px, 0px)').css('transition-delay', '.1s')
        $('.toggleBtn .bar2').css('opacity', '1')
    }



    // Meals Part:
    async function getMeals() {
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s`)
        let finalRes = await respone.json()
        mealsArr =  finalRes.meals.slice(0,20)
        displayMeals(mealsArr)
    }

    function displayMeals(arr) {
        let box = `<h2 class="text-white mt-1">All Meals</h2>`
        for (let i = 0; i < arr.length; i++) {
            box += `
            <div class="col-md-3">
                    <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2">
                        <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                        <div class="mealLayer position-absolute d-flex align-items-center justify-content-center p-2 ">
                            <h3>${arr[i].strMeal}</h3>
                        </div>
                    </div>
                </div>`    
        }
        mealData.innerHTML = box
    }

    // getting Meal Details:
    async function getMealDetails(id) {
        mealData.innerHTML = ''
        $(".innerLoading").fadeIn(500)
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        let finalRes = await respone.json();
        displayMealDetails(finalRes.meals[0])
        $(".innerLoading").fadeOut(500) 
    }

    // Display Meal Details:
    function displayMealDetails(meal) {
    
        let strIngredientList = ``
        for (let i = 1; i < 20; i++) {
            if (meal[`strIngredient${i}`]) {
                strIngredientList += `<li class="alert alert-warning m-2 p-2">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
            }   
        }
        let tagsList = ``
        if(meal.strTags){
            let tagArr = meal.strTags.split(',')
            for (let i = 0; i < tagArr.length; i++) {
                tagsList += `<li class="alert alert-info m-2 p-1">${tagArr[i]}</li>`   
            }
        } 
        let box = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="Meal Details" srcset="">
            <h1>${meal.strMeal}</h1>
                </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${strIngredientList}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsList}
            </ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-outline-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-outline-danger">Youtube</a>
        </div>`
        mealData.innerHTML = box
    }



    // Category Part:
    async function getcategories() {
        mealData.innerHTML = ''
        $(".innerLoading").fadeIn(500)
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        let finalRes = await respone.json()
        let mealsCategory = finalRes.categories
        // console.log (mealsCategory)
        displayCategories(mealsCategory)
        $(".innerLoading").fadeOut(500)  
    }

    function displayCategories(arr) {
            let box = `<h2 class="text-white mt-1 mb-3">Meal Categories</h2>`
            for (let i = 0; i < arr.length; i++) {
                box += `
                <div class="col-md-4">
                        <div onclick="getCategoryMeals('${arr[i].strCategory}')"  class="meal position-relative overflow-hidden rounded-2">
                            <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                            <div class="mealLayer position-absolute text-center p-2 ">
                                <h4>${arr[i].strCategory}</h4>
                                <p class='fs-6'>${arr[i].strCategoryDescription}</p>
                            </div>
                        </div>
                </div>`            
            }
            mealData.innerHTML = box
        }

    async function getCategoryMeals(category) {
        mealData.innerHTML = ''
        $(".innerLoading").fadeIn(500)
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        let finalRes = await response.json()
        // console.log (finalRes)
        displayMeals(finalRes.meals.slice(0, 20))
        $(".innerLoading").fadeOut(500) 
    }

    // Category Button:
    $('.side-nav-menu .links .cat').click(function () { 
        getcategories()
        closeSideNav()  // better for user experience
        hideSearch_Contact() 
    });



    // Area Part:
    async function getArea() {
        mealData.innerHTML = ''
        $(".innerLoading").fadeIn(500)
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
        let finalRes = await response.json()
        let mealsArea = finalRes.meals
        displayArea(mealsArea)
        $(".innerLoading").fadeOut(500)
    }

    //strArea
    function displayArea(arr) {
        let box = `<h2 class="text-white mt-1 mb-3">Meal Areas</h2>`
        for (let i = 0; i < arr.length; i++) {
            box += `
            <div class="col-md-4 my-4">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="meal position-relative overflow-hidden d-flex justify-content-center align-items-center flex-column hovering">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3 class="my-0">${arr[i].strArea}</h3>
                </div>
            </div>`   
        }
        mealData.innerHTML = box
    }

    async function getAreaMeals(ar) {
        mealData.innerHTML = ''
        $(".innerLoading").fadeIn(500)
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${ar}`)
        let finalRes = await response.json()
        displayMeals(finalRes.meals.slice(0, 20))
        $(".innerLoading").fadeOut(500)
    }

    // Area Button:
    $('.side-nav-menu .links .area').click(function () { 
        closeSideNav()
        getArea()
        hideSearch_Contact() 
    });



    // Ingredient Part:
    async function getIngredients() {
        mealData.innerHTML = ""
        $(".innerLoading").fadeIn(500)
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        let finalRes = await respone.json()
        // console.log(finalRes.meals);
        displayIngredients(finalRes.meals.slice(0, 20))
        $(".innerLoading").fadeOut(500)
    }

    function displayIngredients(ing) {
        let box =  `<h2 class="text-white mt-1 mb-3">Meal Ingredients</h2>`
        for (let i = 0; i < ing.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${ing[i].strIngredient}')" class="meal rounded-2 text-center cursor-pointer hovering">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h4>${ing[i].strIngredient}</h4>
                    <p>${ing[i].strDescription.split('.')[0]}.</p> 
                </div>
        </div>`
        }
        mealData.innerHTML = box
    }

    async function getIngredientsMeals(ing) {
        mealData.innerHTML = ''
        $(".innerLoading").fadeIn(500)
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`)
        let finalRes = await respone.json()
        console.log (finalRes.meals)
        displayMeals(finalRes.meals)
        $(".innerLoading").fadeOut(500)

    }

    // Ingredient Button:
    $('.side-nav-menu .links .ingr').click(function () { 
        closeSideNav()  // better for user experience
        getIngredients()
        hideSearch_Contact() 
    });



    // SEARCH PART
    function hideMeal_Contact() {
        $('.mainContent').fadeOut(200);
        $('.contactUs').fadeOut(200, function () {
            $('#searchContainer').fadeIn(500);
        })
    }
    $('.side-nav-menu .links .ser').click(function () {
        closeSideNav()
        $(".innerLoading").fadeIn(500, function () {
            hideMeal_Contact()
            $(".innerLoading").fadeOut(500)
        })
    })

    // Go To Search Inputs:
    $('.side-nav-menu .links .ser').click(function () { 
        closeSideNav()
        $(".innerLoading").fadeIn(500, function () {
            $('.mainContent').fadeOut(500, function () {
                $('.contactUs').fadeOut(500, function () {
                    $('#searchContainer').fadeIn(500, function () {
                        $(".innerLoading").fadeOut(500)
                    })
                })
            })
        })        
    });
    

    // getting Search Inputs:
    let nameSearch = document.querySelector('#searchContainer .nameSearch')
    let fLettSearch = document.querySelector('#searchContainer .fLettSearch')

    // Searching by Name:
    nameSearch.addEventListener('input', function () {
        mealData.innerHTML = ''
        $('.mainContent').fadeIn(500);
        let value = nameSearch.value.trim() 
        getApiSearchByName(value)
    })
    async function getApiSearchByName(val) {
        $(".innerLoading").fadeIn(500)
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`)
        let finalRes = await response.json()
        finalRes.meals ? displayMeals(finalRes.meals) : displayMeals([])
        $(".innerLoading").fadeOut(500)
    }
    
    // Searching by First letter:
    fLettSearch.addEventListener('input', function () {
        mealData.innerHTML = ''
        $('.mainContent').fadeIn(500);
        let value = fLettSearch.value.trim() 
        !value ? value = 'a' : ''
        getApiSearchByFLett(value)
    })
    async function getApiSearchByFLett(val) {
        $(".innerLoading").fadeIn(500)
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${val}`)
        let finalRes = await response.json()
        finalRes.meals ? displayMeals(finalRes.meals) : displayMeals([])
        $(".innerLoading").fadeOut(500)
    }






    // Contact Part:
    $('.side-nav-menu .links .contact').click(function () { 
        closeSideNav()
        $(".innerLoading").fadeIn(500, function () {
            $('.mainContent').fadeOut(500, function () {
                $('.contactUs').fadeIn(500).css('display', 'flex' ,function () {
                    $(".innerLoading").fadeOut(500)
                });
            });          
        })        
    });


    // Getting Contact Inputs:
    let userName = document.querySelector('.contactUs #name')
    let userAge = document.querySelector('.contactUs #age')
    let userMail = document.querySelector('.contactUs #mail') 
    let userPhone = document.querySelector('.contactUs #phone')
    let userPass = document.querySelector('.contactUs #pass')
    let confirmPass = document.querySelector('.contactUs #confirmPass')
    let submitBtn = document.querySelector('.contactUs button') 
    let dataInputs = document.querySelectorAll('.contactUs .form-control')
    let errorMsgs = document.querySelectorAll('.contactUs .form-input .errorMsg')
    let errorIcons = document.querySelectorAll('.contactUs .form-input i')
    submitBtn.setAttribute('disabled', true)
    


    // Setting Error $ Success Messages:

    function setErrorFor(input, msg) {
        input.classList.add('error-class')
        input.classList.remove('sucess-class')
        input.classList.remove ('mb')
        let inputForm = input.parentElement
        let errorMsg = inputForm.querySelector('small')
        errorMsg.classList.remove('hide')
        errorMsg.innerText = msg
        let errorIcon = inputForm.querySelector('.text-danger-emphasis')
        let sucessIcon = inputForm.querySelector('.text-success-emphasis')
        errorIcon.classList.remove('hide')
        sucessIcon.classList.add('hide')
        return false  
    }
    function setSucessFor(input) {
        input.classList.add('sucess-class')
        input.classList.remove('error-class')
        input.classList.add ('mb')
        let inputForm = input.parentElement
        let errorMsg = inputForm.querySelector('small')
        errorMsg.classList.add('hide')
        let sucessIcon = inputForm.querySelector('.text-success-emphasis')
        let errorIcon = inputForm.querySelector('.text-danger-emphasis')
        sucessIcon.classList.remove('hide')
        errorIcon.classList.add('hide')
        return true
    }

    function isName(name) {
        return /^[a-zA-Z ]+$/.test(name)
    }
    function isAge(age) {
        return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(age)
    }
    function isMail(mail) {
        // return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)
        return /^[\w-\.]+@([\w-]+\.)+[a-zA-Z]{2,4}$/.test(mail)
    }
    function isPhone(phone) {
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)
    }
    function isPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)
    }

    function checkName() {
        let name = userName.value.trim()
        // if (checkValue) {
        // }
        if (name === '') {
            return setErrorFor (userName, `Please Enter Your Name`)
        }else if (name.length < 3 || name.length > 25 ) {
            return setErrorFor (userName, `Name must be between 3 and 25 characters.`)
        }else if (!isName(name)) {
            return setErrorFor (userName, `Special characters and numbers are not allowed`)
        }else return setSucessFor(userName) 
    }

    userName.addEventListener('input', function () {
        checkName()
        validation()
    })


    function checkAge() {
        let age = userAge.value
        // if (checkValue) {
        // }
        if (age === '') {
            return setErrorFor (userAge, `Please Enter Your Age`)
        }else if (!isAge(age)) {
            return setErrorFor (userAge, `Age is not valid`)
        }else return setSucessFor(userAge)   
    }

    userAge.addEventListener('input', function () {
        checkAge()
        validation()
    })


    function checkMail() {
        let mail = userMail.value.trim()
        // if (checkValue) {
        // }
        if (mail === '') {
            return setErrorFor (userMail, `Please Enter Your E-mail`)
        }else if (!isMail(mail)) {
            return setErrorFor (userMail, `E-mail is not valid *exemple@yyy.zzz`)
        }else return setSucessFor(userMail)   
    }

    userMail.addEventListener('input', function () {
        checkMail()
        validation()
    })


    function checkPhone() {
        let phone = userPhone.value.trim()
        if (phone === '') {
            return setErrorFor (userPhone, `Please Enter Your Phone Number`)
        }else if (!isPhone(phone)) {
            return setErrorFor (userPhone, `Phone number is not valid`)
        }else return setSucessFor(userPhone)  
    }

    userPhone.addEventListener('input', function () {
        checkPhone()
        validation()
    })


    function checkPassword() {
        let password = userPass.value.trim()
        if (password === '') {
            return setErrorFor (userPass, `Please Enter Your Password`)
        }else if (!isPassword(password)) {
            return setErrorFor (userPass, `Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)`)
        }else return setSucessFor(userPass)   
    }

    userPass.addEventListener('input', function () {
        checkPassword()
        validation()
    })


    function checkConfirmationPassword() {
        let confirmationpassword = confirmPass.value.trim()
        let userpassword = userPass.value.trim()
        if (confirmationpassword === '') {
            return setErrorFor (confirmPass, `Please Re-enter the password again`)
        }else 
        if (confirmationpassword !== userpassword) {
            return setErrorFor (confirmPass, `Confirm password does not match`)
        }else return setSucessFor(confirmPass)   
    }

    confirmPass.addEventListener('input', function () {
        checkConfirmationPassword()
        validation()
    })

    function validation() {
        if (checkName() && checkAge() && checkMail() && checkPhone() && checkPassword() && checkConfirmationPassword()) {
                submitBtn.removeAttribute('disabled')
        }else submitBtn.setAttribute('disabled', true)  
    }

    function clearForm(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].value = '';  
            arr[i].classList.add('mb')
            arr[i].classList.remove('error-class')
        }
    }

    function clearErrors(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].classList.add('hide')  
        }
    }

    function hideSearch_Contact() {
        $('#searchContainer').fadeOut(200)
        $('.contactUs').fadeOut(200, function () {
            $('.mainContent').fadeIn(500);
        })
        clearForm(dataInputs)
        clearErrors(errorMsgs)
        clearErrors(errorIcons)
    }

    // Go To Contact Inputs:
    $('.side-nav-menu .links .contact').click(function () { 
        closeSideNav()
        $(".innerLoading").fadeIn(500, function () {
            $('.mainContent').fadeOut(500, function () {
                $('#searchContainer').fadeOut(200, function () {
                    $('.contactUs').fadeIn(500, function () {
                        $(".innerLoading").fadeOut(500)
                    })
                })
            })
        })        
    });













































    // userName.addEventListener('focus', function () {
    //     checkValue = true 
    //     userName.oninput = function () {
    //         checkName(checkValue)
    //         validation()
    //     }
    // })

    // userAge.addEventListener('focus', function () {
    //     checkValue = true
    //     userAge.oninput = function () {
    //         checkAge(checkValue)
    //         validation()
    //     }
    // })

    // userMail.addEventListener('focus', function () {
    //     checkValue = true
    //     userMail.oninput = function () {
    //         checkMail(checkValue)
    //         validation()
    //     }
    // })

    // userPhone.addEventListener('focus', function () {
    //     checkValue = true
    //     userPhone.oninput = function () {
    //         checkPhone(checkValue)
    //         validation()
    //     }
    // })

    // userPass.addEventListener('focus', function () {
    //     checkValue = true
    //     userPass.oninput = function () {
    //         checkPassword(checkValue)
    //         validation()
    //     }
    // })

    // confirmPass.addEventListener('focus', function () {
    //     checkValue = true
    //     console.log (checkValue)
    //     confirmPass.oninput = function () {
    //         console.log (checkValue)
    //         checkConfirmationPassword(checkValue)
    //         validation()
    //     }
    // })

    // let nameValid = false
    // let ageValid = false
    // let mailValid = false
    // let phoneValid = false
    // let passValid = false
    // let rePassValid = false

    // userName.addEventListener('focus', ()=> nameValid = true)
    // userAge.addEventListener('focus', ()=> ageValid = true)
    // userMail.addEventListener('focus', ()=> mailValid = true)
    // userPhone.addEventListener('focus', ()=> phoneValid = true)
    // userPass.addEventListener('focus', ()=> passValid = true)
    // confirmPass.addEventListener('focus', ()=> rePassValid = true)
    // userName.oninput = ()=> checkValidationInputs()
    // userAge.oninput = ()=> checkValidationInputs()
    // userMail.oninput = ()=> checkValidationInputs()
    // userPhone.oninput = ()=> checkValidationInputs()
    // userPass.oninput = ()=> checkValidationInputs()
    // confirmPass.oninput = ()=> checkValidationInputs()


    // function checkValidationInputs () {
    //     // if (checkName()) {
    //     //     nameValid = true
    //     // }
    //     // if (checkAge()) {
    //     //     ageValid = true
    //     // }
    //     // if (checkMail()) {
    //     //     mailValid = true
    //     // }
    //     // if (checkPhone()) {
    //     //     phoneValid = true
    //     // }
    //     // if (checkPassword()) {
    //     //     passValid = true
    //     // }
    //     // if (checkConfirmationPassword()) {
    //     //     rePassValid = true
    //     // }
    //     if (nameValid) {
    //         checkName()
    //     }
    //     if (ageValid) {
    //         checkAge()
    //     }
    //     if (mailValid) {
    //         checkMail()
    //     }
    //     if (phoneValid) {
    //         checkPhone()
    //     }
    //     if (passValid) {
    //         checkPassword()
    //     }
    //     if (rePassValid) {
    //         checkConfirmationPassword()
    //     }
    //     validation()
    // }































































    // let mn = ''
    // console.log (!mn)
    //.split(" ").slice(0,20).join(" ")
    // let my = `i love how old are you. i'm fine thank you for coming`
    // let arr = my.substring(0, 10)
    // let newarr = my.split(' ').slice(0,10)
    // console.log (...newarr)

    // console.log (arr)
    // // <p>${ing[i].strDescription.substring(0,30)}</p>










