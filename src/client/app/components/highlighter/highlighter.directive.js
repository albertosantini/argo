"use strict";

(function () {
    angular
        .module("components.highlighter")
        .directive("highlighter", highlighter);

    highlighter.$inject = ["$timeout"];
    function highlighter($timeout) {
        var directive = {
            restrict: "A",
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            scope.$watch(attrs.highlighter, function (newValue, oldValue) {
                var newclass;

                if (newValue !== oldValue) {
                    newclass = newValue < oldValue ?
                        "highlight-red" : "highlight-green";

                    element.addClass(newclass);

                    $timeout(function () {
                        element.removeClass(newclass);
                    }, 500);
                }
            });
        }
    }

}());
