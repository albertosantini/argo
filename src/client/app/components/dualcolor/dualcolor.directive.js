"use strict";

{
    angular
        .module("components.dualcolor")
        .directive("dualColor", dualColor);

    dualColor.$inject = [];
    function dualColor() {
        const directive = {
            restrict: "A",
            link
        };

        return directive;

        function link(scope, element, attrs) {
            scope.$watch(attrs.dualColor, (newValue, oldValue) => {
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

}
