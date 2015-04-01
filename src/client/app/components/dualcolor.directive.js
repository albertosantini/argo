"use strict";

(function () {
    angular
        .module("argo")
        .directive("argoDualColor", argoDualColor);

    argoDualColor.$inject = [];
    function argoDualColor() {
        var directive = {
            restrict: "A",
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            scope.$watch(attrs.argoDualColor, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue > 0) {
                        element.removeClass("highlight-red");
                        element.addClass("highlight-green");
                    }
                    if (newValue < 0) {
                        element.removeClass("highlight-green");
                        element.addClass("highlight-red");
                    }
                }
            });
        }
    }

}());
