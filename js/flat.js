// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
};

function FlatApplication($) {
    $('.btn-group').on('click', 'a', function () {
        $(this).siblings().removeClass('active').end().addClass('active');
    });


}
