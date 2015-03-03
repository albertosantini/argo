"use strict";

(function () {
    angular
        .module("argo")
        .directive("argoHighlighter", argoHighlighter);

    argoHighlighter.$inject = ["$timeout"];
    function argoHighlighter($timeout) {
        var directive = {
            restrict: "A",
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            scope.$watch(attrs.argoHighlighter, function (newValue, oldValue) {
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
