(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["exports"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    "use strict"

    var cachedCompileProvider;
    const simpleModal = angular.module('simple-modal', [])
    .config(['$compileProvider', function($compileProvider){
        cachedCompileProvider = $compileProvider;
    }])
    .factory('modalService', modalService)
    .name;

    modalService.$inject = ['$rootScope', '$window', '$sce', '$compile'];
    function modalService($rootScope, $window, $sce, $compile) {

        /** The open() gets configuration object with optional properties:
        * template - which will be wrapped with modal
        * scope - object with properties to put on modal's scope
        * backdropClosing - flag deciding if clicking on backdrop should close modal
        * onClose - callback for additional operations to execute on closing modal
        * controller - controller function for modal contents */
        function open({ template = '', scope = {}, backdropClosing = true, onClose = () => {}, controller = ($scope) => {} }) {
            let modalTemplate = prepareContentsTemplate(template);
            let modalScope = prepareScope(scope, onClose, backdropClosing);
            let modalDDO = new ModalDDO(modalScope, controller, modalTemplate);
            const suffix = registerModalDirective(modalDDO);
            let modalEl = buildModal(suffix);
            showModal(modalEl);
            return {close: modalEl.scope().closeModal};
        }

        function prepareContentsTemplate(template) {
            return $sce.trustAsHtml(template);
        }

        function prepareScope(scope, closeFn, backdropClosing) {
            scope._onClose = closeFn;
            scope._bckdropClosing = backdropClosing;
            return scope;
        }

        function ModalDDO(scopeObj, controllerFn, contentsTemplate) {
            this.restrict = 'E';
            this.scope = {};
            this.controller = function($scope, $element) {
                // add public close method
                $scope.closeModal = function closeModal(answer) {
                    scopeObj._onClose(answer);
                    $scope.$destroy();
                    $element.remove();
                };

                // add "internal" closing method for backdrop
                // closing from backdrop needs to ensure what was actually clicked
                // (otherwise clicking on modal would close it)
                $scope._backdropClose = function($event) {
                    if (scopeObj._bckdropClosing && $event && $event.target.id === 'nsm-backdrop') {
                        $scope.closeModal();
                    }
                };

                angular.merge($scope, scopeObj);

                controllerFn($scope);
            }
            this.controller.$inject = ["$scope", "$element"];
            this.replace = false;
            this.transclude = true;
            this.template = `
                <div id="nsm-backdrop" ng-click="_backdropClose($event)">
                    <style>
                        #nsm-backdrop {
                            position: fixed;
                            top: 0; bottom: 0; left: 0; right: 0;
                            background-color: rgba(0,0,0,0.7);
                            z-index: 5;
                        }
                        #nsm-modal {
                            position: fixed;
                            top: 50%; left: 50%;
                            transform: translatey(-50%) translatex(-50%);
                            z-index: 6;
                        }
                    </style>
                    <div id="nsm-modal">${contentsTemplate}</div>
                </div>`;
        }

        function registerModalDirective(modalDDO) {
            const suffix = hash(modalDDO.template);

            cachedCompileProvider.directive(`nsmModalWrapper${suffix}`, function() {
                return modalDDO;
            });

            return suffix;
        }

        function buildModal(suffix) {
            const directiveName = `<nsm-modal-wrapper${suffix}></nsm-modal-wrapper${suffix}>`;

            return $compile(directiveName)($rootScope.$new(true));
        }

        function showModal(modalEl) {
            $window.document.body.appendChild(modalEl[0]);
        }

        return { open };
    }

    return simpleModal;

    function hash(str) {
      var hash = 5381,
          i = str.length;

      while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
      }

      /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
       * integers. Since we want the results to be always positive, convert the
       * signed int to an unsigned by doing an unsigned bitshift. */
      return hash >>> 0;
    }
}));
