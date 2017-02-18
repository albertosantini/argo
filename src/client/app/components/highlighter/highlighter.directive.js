export function highlighterDirective($timeout) {
    const directive = {
        restrict: "A",
        link
    };

    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.highlighter, (newValue, oldValue) => {
            let newclass;

            if (newValue !== oldValue) {
                newclass = newValue < oldValue ?
                    "highlight-red" : "highlight-green";

                element.addClass(newclass);

                $timeout(() => {
                    element.removeClass(newclass);
                }, 500);
            }
        });
    }
}
highlighterDirective.$inject = ["$timeout"];
