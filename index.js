import * as THREE from '/js/three.module.js';
import { OrbitControls } from '/js/OrbitControls.js';

(function () {
    'use strict';
    /* 	'To actually be able to display anything with Three.js, we need three things:
        A scene, a camera, and a renderer so we can render the scene with the camera.' 
               
               - https://threejs.org/docs/#Manual/Introduction/Creating_a_scene 		*/

    var scene, camera, renderer;

    /* We need this stuff too */
    var container, aspectRatio,
        HEIGHT, WIDTH, fieldOfView,
        nearPlane, farPlane,
        mouseX, mouseY, windowHalfX,
        windowHalfY, stats, geometry,
        starStuff, materialOptions, stars, controls;

    init();
    animate();

    function init() {
        container = document.getElementsByClassName("threejs")[0];

        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        aspectRatio = WIDTH / HEIGHT;
        fieldOfView = 75;
        nearPlane = 1;
        farPlane = 1000;
        mouseX = 0;
        mouseY = 0;

        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        /* 	fieldOfView — Camera frustum vertical field of view.
                aspectRatio — Camera frustum aspect ratio.
                nearPlane — Camera frustum near plane.
                farPlane — Camera frustum far plane.	
    
                - https://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
    
                 In geometry, a frustum (plural: frusta or frustums) 
                 is the portion of a solid (normally a cone or pyramid) 
                 that lies between two parallel planes cutting it. - wikipedia.		*/

        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        //Z positioning of camera

        camera.position.z = farPlane / 2;
        camera.position.z += 1500;

        scene = new THREE.Scene({ antialias: true });
        scene.fog = new THREE.FogExp2(0x000000, 0.00099);

        // The wizard's about to get busy.
        starForge();

        //check for browser Support
        if (webGLSupport()) {
            //yeah?  Right on...
            renderer = new THREE.WebGLRenderer({ alpha: true });

        } else {
            //No?  Well that's okay.
            renderer = new THREE.CanvasRenderer();
        }

        renderer.setClearColor(0x000011, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener("scroll", moveCamera);
        setSceneHeight(window.innerHeight + 2500);

        controls = new OrbitControls(camera, document.body);
        controls.enabled = false;
        controls.autoRotate = true;
        controls.update();

        startTime();
        var d = new Date();
        var mm = d.getMonth() + 1;
        var dd = d.getDate();
        var yy = d.getFullYear();
        mm = checkTime(mm);
        dd = checkTime(dd);
        yy = checkTime(yy);
        document.getElementById('date').innerHTML = "[" + mm + "/" + dd + "/" + yy + "]";
        document.getElementById('day').innerHTML = "[DAY /- " + checkTime(daysIntoYear(d)) + "]";

        let text = baffle(".scramble");

        setTimeout(function () {
            $(".camera").removeClass("hide");
            Draw(".bg");
            text.start();
            setTimeout(function () {
                $(".scene").addClass("roto");
                $(".info").addClass("show");
                $(".info").removeClass("hide");
                setTimeout(function () {
                    text.reveal(500);
                    $('body').removeClass('stop-scrolling');
                }, 500)
            }, 1500)
        }, 3500)

        var type = new Typewriter(".dialogue", {
            cursor: "_",
        });
        type.changeDelay(20);
        type.changeDeleteSpeed('natural');

        type.typeString('incoming request')
            .pauseFor(500)
            .deleteAll()
            .typeString("welcome")
            .pauseFor(1500)
            .deleteAll()
            .typeString("to begin please [scroll]")
            .start();

    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        render();
    }

    function render() {
        //
        camera.position.x += (mouseX - camera.position.x) * 0.005;
        camera.position.y += (- mouseY - camera.position.y) * 0.0025;
        controls.update();
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }


    function webGLSupport() {
        /* 	The wizard of webGL only bestows his gifts of power
            to the worthy.  In this case, users with browsers who 'get it'.		*/

        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (
                canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
            );
        } catch (e) {
            // console.warn('Hey bro, for some reason we\'re not able to use webGL for this.  No biggie, we\'ll use canvas.');
            return false;
        }
    }

    function onWindowResize() {

        // Everything should resize nicely if it needs to!
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
        renderer.setSize(WIDTH, HEIGHT);
    }


    function starForge() {
        /* 	Yep, it's a Star Wars: Knights of the Old Republic reference,
            are you really surprised at this point? 
                                                    */
        var starQty = 10000;
        geometry = new THREE.BoxGeometry(1000, 1000, 1000);

        materialOptions = {
            size: 1.0, //I know this is the default, it's for you.  Play with it if you want.
            transparency: true,
            opacity: 0.7
        };

        starStuff = new THREE.PointsMaterial(materialOptions);

        // The wizard gaze became stern, his jaw set, he creates the cosmos with a wave of his arms

        for (var i = 0; i < starQty; i++) {

            var starVertex = new THREE.Vector3();
            starVertex.x = Math.random() * 2000 - 1000;
            starVertex.y = Math.random() * 2000 - 1000;
            starVertex.z = Math.random() * 2000 - 1000;

            geometry.vertices.push(starVertex);

        }


        stars = new THREE.Points(geometry, starStuff);
        scene.add(stars);
    }

    function onMouseMove(e) {

        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }

    function Draw(letter) {
        var animation = anime({
            targets: letter + ' path',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 1000,
            delay: anime.stagger(50),
            direction: 'alternate',
            loop: false,
            autoplay: false
        });

        animation.play();
    }

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    function daysIntoYear(date) {
        return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
    }

    function startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        h = checkTime(h);
        m = checkTime(m);
        s = checkTime(s);
        document.getElementById('time').innerHTML = "[" + h + ":" + m + ":" + s + "]";

        var t = setTimeout(function () {
            startTime()
        }, 500);
    }

    function setSceneHeight(height) {
        document.documentElement.style.setProperty("--viewportHeight", height);
    }

    function useGiphySearch() {
        fetch('https://api.giphy.com/v1/gifs/random?api_key=' +
            GIPHY_API_KEY + '&tag=motivation')
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(result => {
                gif_data.push(result);
            })
            .then(res => {
                gif_container.src = gif_data[0].data.image_original_url;
            })
            .catch(error => console.log('API failure' + error));
    }

    function useQuoteSearch() {
        fetch('https://goquotes-api.herokuapp.com/api/v1/random?count=1')
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(result => {
                quotes_data.push(result);
                console.log(quotes_data);
            })
            .then(res => {
                quote_container.innerHTML = quotes_data[0].quotes[0].text;
                author_container.innerHTML = '- ' + quotes_data[0].quotes[0].author;
            })
            .catch(error => console.log('API failure' + error));
    }

    function useFactSearch() {
        fetch('https://uselessfacts.jsph.pl/random.json?language=en')
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(result => {
                fact_data.push(result);
                console.log(fact_data);
            })
            .then(res => {
                fact_container.innerHTML = fact_data[0].text;
            })
            .catch(error => console.log('API failure' + error));
            
    }

    var text = baffle(".scramble");
    var ct = document.querySelector('.container');
    var front = document.querySelector('.front-panel');
    var back = document.querySelector('.back-panel');
    var top = document.querySelector('.top-panel');
    var bottom = document.querySelector('.bottom-panel');
    const GIPHY_API_KEY = 'GZGm2xBF996epHP34ZvCQSfHqfugux5X';
    const gif_container = document.getElementById('gif');
    let gif_data = [];
    var gif_check = false;
    const quote_container = document.getElementById('quote');
    const author_container = document.getElementById('quote-author');
    let quotes_data = [];
    var quotes_check = false;
    const fact_container = document.getElementById('fact');
    let fact_data = [];
    var fact_check = false;

    function moveCamera() {
        $(".dialogue").remove();
        //console.log(window.pageYOffset)  
        if (window.pageYOffset < 2500) {
            document.documentElement.style.setProperty("--cameraZ", window.pageYOffset);
            document.addEventListener('mousemove', onMouseMove, false);
            controls.autoRotateSpeed = 2;
            controls.update();
        }
        if (window.pageYOffset >= 2500) {
            document.removeEventListener("mousemove", onMouseMove)
            controls.autoRotateSpeed = 4;
            controls.update();
        }
        text.start();
        if (window.pageYOffset == 0) {
            // zoom out - end//
            text.reveal(1000);
        }
        else if (window.pageYOffset < 2500 && window.pageYOffset > 0) {
            // zoomingIn //
            $(".scene").removeClass("rand");
            $(".scene").addClass("roto");
            rand();
            setSceneHeight(window.innerHeight + 2500);
            $(".greeting-root").removeClass("tv-on");
            $(".greeting-root").addClass("tv-off");
        }
        else if (window.pageYOffset == 2500) {
            // front panel - onEnter //
            $(".scene").removeClass("roto");
            $(".scene").addClass("rand");
            $('body').addClass('stop-scrolling');
            setTimeout(function () {
                $('body').removeClass('stop-scrolling');
                $(".scene").removeClass("rand");
            }, 250)
            setSceneHeight(window.innerHeight + 2500 + 2160);
            $(".greeting-root").addClass("tv-on");
            $(".greeting-root").removeClass("tv-off");
        }
        else if (window.pageYOffset < 2860 && window.pageYOffset > 2500) {
            // front panel - static //
            document.documentElement.style.setProperty("--sceneY", 0);
            document.documentElement.style.setProperty("--rotateX", 0);
            document.documentElement.style.setProperty("--cameraZ", 2500);
            $(".greeting-root").addClass("tv-on");
            $(".greeting-root").removeClass("tv-off");
        }
        else if (window.pageYOffset < 3220 && window.pageYOffset > 2860) {
            // rotating to bottom panel //
            document.documentElement.style.setProperty("--sceneY", 2860 - window.pageYOffset);
            document.documentElement.style.setProperty("--rotateX", (2860 - window.pageYOffset) / 4);
            document.documentElement.style.setProperty("--cameraZ", (window.pageYOffset - 360));
            $(".greeting-root").removeClass("tv-on");
            $(".greeting-root").addClass("tv-off");
            $("#gif").removeClass("tv-on");
            $("#gif").addClass("tv-off");
            gif_check = true;

        }
        else if (window.pageYOffset < 3580 && window.pageYOffset > 3220) {
            // bottom panel - static //
            document.documentElement.style.setProperty("--sceneY", -360);
            document.documentElement.style.setProperty("--rotateX", -90);
            document.documentElement.style.setProperty("--cameraZ", 2865);
            $("#gif").addClass("tv-on");
            $("#gif").removeClass("tv-off");
            if(gif_check) {
                gif_data = [];
                useGiphySearch();
                gif_check = false;
            }
            
            // touch up //
            document.getElementsByClassName("front-panel")[0].style.setProperty("opacity", "100%");
        }
        else if (window.pageYOffset < 3940 && window.pageYOffset > 3580) {
            // rotating to back panel //
            document.documentElement.style.setProperty("--sceneY", -360 - (3580 - window.pageYOffset));
            document.documentElement.style.setProperty("--rotateX", (3220 - window.pageYOffset) / 4);
            document.documentElement.style.setProperty("--cameraZ", (window.pageYOffset - 720));
            $("#gif").removeClass("tv-on");
            $("#gif").addClass("tv-off");
            gif_check = true;
            $(".quote-root").removeClass("tv-on");
            $(".quote-root").addClass("tv-off");
            quotes_check = true;
            // touch up  //
            if (window.pageYOffset > 3760) {
                document.getElementsByClassName("front-panel")[0].style.setProperty("opacity", "0%");
            }
            else {
                document.getElementsByClassName("front-panel")[0].style.setProperty("opacity", "100%");
            }
        }
        else if (window.pageYOffset < 4300 && window.pageYOffset > 3940) {
            // back panel //
            document.documentElement.style.setProperty("--sceneY", 0);
            document.documentElement.style.setProperty("--rotateX", -180);
            document.documentElement.style.setProperty("--cameraZ", 3225);
            $(".quote-root").addClass("tv-on");
            $(".quote-root").removeClass("tv-off");
            if(quotes_check) {
                quotes_data = [];
                useQuoteSearch();
                quotes_check = false;
            }
        }
        else if (window.pageYOffset < 4660 && window.pageYOffset > 4300) {
            document.documentElement.style.setProperty("--sceneY", window.pageYOffset - 4300);
            document.documentElement.style.setProperty("--rotateX", (3580 - window.pageYOffset) / 4);
            document.documentElement.style.setProperty("--cameraZ", ((4660 - (window.pageYOffset - 4300)) - 1440));
            $(".quote-root").removeClass("tv-on");
            $(".quote-root").addClass("tv-off");
            quotes_check = true;
            $(".fact-root").removeClass("tv-on");
            $(".fact-root").addClass("tv-off");
            fact_check = true;
            if (window.pageYOffset > 4500) {
                document.getElementsByClassName("front-panel")[0].style.setProperty("opacity", "100%");
            }
            else {
                document.getElementsByClassName("front-panel")[0].style.setProperty("opacity", "0%");
            }
        }
        else if (window.pageYOffset == 4660) {
            document.documentElement.style.setProperty("--sceneY", 360);
            document.documentElement.style.setProperty("--rotateX", -270);
            document.documentElement.style.setProperty("--cameraZ", 2865);
            document.getElementsByClassName("front-panel")[0].style.setProperty("opacity", "100%");
            $(".fact-root").addClass("tv-on");
            $(".fact-root").removeClass("tv-off");
            if(fact_check) {
                fact_data = [];
                useFactSearch();
                fact_check = false;
            }
        }

    }

    function getRndInteger(min, max) {
        return (Math.floor(Math.random() * (max - min)) + min) * (Math.round(Math.random()) * 2 - 1);
    }

    function rand() {
        document.documentElement.style.setProperty("--randX", getRndInteger(0, 15));
        document.documentElement.style.setProperty("--randY", getRndInteger(0, 15));
    }


})();