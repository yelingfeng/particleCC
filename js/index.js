/**
 * Created by  on 2015/11/3.
 */
require.config({
    baseUrl: "./js",
    paths : {
        'jquery' : "./lib/jquery-1.10.1.min",
        'tweenLite' : "./lib/TweenLite.min",
    }
});

require(["cc"]);