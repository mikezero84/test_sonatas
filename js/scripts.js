/**
 * Created by mguzman on 3/6/17.
 */

$.TestElevator = $.TestElevator || {};
$.TestElevator.status = 0;

$.TestElevator.takingElevator = function (e) {
    e.preventDefault();
    $('.full').css('background', '../img/floor.jpg');
};

$.TestElevator.changeLocation = function () {
    $('.floor-lvl').text($('#location').val());
};

$.TestElevator.openDoors = function () {
    if ($.TestElevator.status !== 2){
        var dl = $.TestElevator.status == 0 ? 0 : $('.door-left').offset().left;
        var dr = $.TestElevator.status == 0 ? 0 : $('.door-right').offset().right;

        $('.door-left').css('border-right',0);
        $('.door-right').css('border-left',0);

        $('.door-left').css({left: dl})
            .animate({left: "-=500"}, "slow");
        $(".door-right").css({right: dr})
            .animate({right: "-=500"}, "slow");


        $.TestElevator.status = 1;
        $('.floorsMenu').find('li.active').removeClass('active')
    }
};

$.TestElevator.closeDoors = function () {
    $('.door-left').css('border-right','2.5');
    $('.door-right').css('border-left','2.5');

    $('.door-left').css({left: "-=500"})
        .animate({left: "0"}, "slow");

    $(".door-right").css({right: '-=500'})
        .animate({right: "0"}, "slow");

    $.TestElevator.status = 0;
};


$.TestElevator.useElevator = function (floor, location) {
    $.ajax({
        url: '/ajax/functions.php',
        type: 'POST',
        data: {floor: floor, location: location},
        success: function(response) {
            console.log('floor: '+floor);
            console.log('location: '+ location);
            console.log(response);
            var jsonResponse = JSON.parse(response)
            var currentFloor = location !== 0 ? location : 0;
            var monitor = '';

            if (jsonResponse.direction == 'up') {
                $('#direction').removeClass('arrow-down').addClass('arrow-up');
                for (var moves = 1; moves <= jsonResponse.floorsToMoves; moves++) {
                    (function (idx) {
                        setTimeout(function () {
                            console.log(idx);
                            console.log('currentFloor: ' + currentFloor);
                            currentFloor++;
                            console.log('moves: '+moves);
                            if(idx == moves - 1){
                                $('#direction').removeClass('arrow-up');
                                $('.floor-lvl').attr('data-floor', currentFloor);
                                $.TestElevator.status = 0;
                                $('.view').css("background","url('../img/floor.jpg') no-repeat center center fixed");
                                $.TestElevator.openDoors();
                            }

                            $('.floor-lvl').text(currentFloor+'f');
                        }, 1000 + (2000 * idx));
                    })(moves);
                }
            }else{
                $('#direction').addClass('arrow-down');
                for (var moves = 1; moves <= jsonResponse.floorsToMoves; moves++) {
                    (function (idx) {
                        setTimeout(function () {
                            console.log(idx);
                            console.log('currentFloor: ' + (currentFloor + idx));
                            currentFloor--;
                            console.log('moves: '+moves);
                            if(idx == moves - 1){
                                $('#direction').removeClass('arrow-down');
                                $('.floor-lvl').attr('data-floor', currentFloor);
                                $.TestElevator.status = 0;
                                $.TestElevator.openDoors();
                            }

                            if(currentFloor !== 0){
                                monitor = currentFloor+'f';
                                $('.view').css("background","url('../img/floor.jpg') no-repeat center center fixed");
                            }else{
                                monitor = 'GR';
                                $('.view').css("background","url('../img/ground.jpg') no-repeat center center fixed");
                            }

                            $('.floor-lvl').text(monitor);
                        }, 1000 + (2000 * idx));
                    })(moves);
                }
            }
        },
        beforeSend: function(){
            $.TestElevator.status = 2;
        }
    });
};

$.TestElevator.floorBtnEvent = function () {
    var floor = parseInt($(this).attr('data-floor'));
    var location = parseInt($('.floor-lvl').attr('data-floor'));

    $(this).addClass('active');

    if(floor == -1 && $.TestElevator.status !== 2){
        $.TestElevator.status == 0 ? $.TestElevator.openDoors() : $.TestElevator.closeDoors();
    }else if($.TestElevator.status !== 2){
        $.TestElevator.status == 1 ? $.TestElevator.closeDoors() : 0;

        $.TestElevator.useElevator(floor, location);
    }
};

$(document).ready(function (){
    $(document).on('click', '#takingElevator', $.TestElevator.takingElevator);
    $(document).on('change', '#location', $.TestElevator.changeLocation);
    $(document).on('click', '.floorBtn', $.TestElevator.floorBtnEvent);
});