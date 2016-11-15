/* jshint jasmine: true */
/* global module, angular, inject */

(function () {
    'use strict';

    describe('multiselect', function () {
        var cardMultiselectHtml,
            $scope,
            $document,
            $timeout,
            $compile,
            actualSelectedItems,
            actualAllSelected,
            onlySelectedHtml = 'bb-listbuilder-on-show-only-selected="listCtrl.toggleOnlySelected(showOnlySelected)" ',
            startMultiselectHtml = '<bb-listbuilder>' +
                '<bb-listbuilder-toolbar>' +
                '<bb-listbuilder-toolbar-multiselect> ' +
                '<bb-listbuilder-multiselect ',
            endMultiselectHtml = 'bb-listbuilder-multiselect-items-changed="listCtrl.itemsChanged(selectedItems, allSelected)" ' +
                'bb-listbuilder-multiselect-selected-items="listCtrl.selectedIds"> ' +
                '<bb-listbuilder-multiselect-select-all ' +
                    'bb-listbuilder-multiselect-on-select-all="listCtrl.selectAll()"> ' +
                '</bb-listbuilder-multiselect-select-all>' +
                '<bb-listbuilder-multiselect-clear-all ' +
                    'bb-listbuilder-multiselect-on-clear-all="listCtrl.clearAll()"> ' +
                '</bb-listbuilder-multiselect-clear-all>' +
                '</bb-listbuilder-multiselect>' +
                '</bb-listbuilder-toolbar-multiselect>' +
                '</bb-listbuilder-toolbar>',
            cardContentHtml = '<bb-listbuilder-content ' +
                '>' +
                '<bb-listbuilder-cards> ' +
                '<bb-listbuilder-card bb-listbuilder-card-id="item.id" ng-repeat="item in listCtrl.data">' +
                '<bb-card bb-card-selectable="true" bb-card-selected="item.selected">' +
                '<bb-card-title>' +
                '{{item.title}}' +
                '</bb-card-title>' +
                '<bb-card-content>' +
                '{{item.content}}' +
                '</bb-card-content>' +
                '</bb-card>' +
                '</bb-listbuilder-card>' +
                '</bb-listbuilder-cards>' +
                '</bb-listbuilder-content>' +
                '</bb-listbuilder>'; 

        beforeEach(module(
            'sky.listbuilder',
            'sky.templates'
        ));

        beforeEach(inject(function (_$rootScope_, _$compile_, _$timeout_, _$document_) {
            $scope = _$rootScope_.$new();
            $compile = _$compile_;
            $timeout = _$timeout_;
            $document = _$document_;
        }));

        function clickCardCheckBox(el, index) {
            el.find('.bb-listbuilder-content .bb-card .bb-check-wrapper input').eq(index).click();
            
            $scope.$digest();
            $timeout.flush();
        }

        function clickSelectAll(el) {
            el.find('.bb-listbuilder-toolbar-multiselect-container .bb-listbuilder-select-all').click();
            $scope.$digest();
        }

        function clickClearAll(el) {
            el.find('.bb-listbuilder-toolbar-multiselect-container .bb-listbuilder-clear-all').click();
            $scope.$digest();
        }

        function clickOnlySelected(el) {
            el.find('.bb-listbuilder-toolbar-multiselect-container .bb-listbuilder-show-selected input').click();
            $scope.$digest();
        }

        function initMultiselect(customHtml) {
            var el = $compile(customHtml)($scope);
            $document.find('body').append(el);
            $scope.$digest();
            return el;
        }
        
        beforeEach(function () {
            cardMultiselectHtml = angular.element(
                startMultiselectHtml +
                endMultiselectHtml +
                cardContentHtml);

            actualSelectedItems = [];
            actualAllSelected = false;

            $scope.listCtrl = {
                data: [
                    {
                        id: 0,
                        title: 'Title 1',
                        content: 'Content 1'
                    },
                    {
                        id: 1,
                        title: 'Title 2',
                        content: 'Content 2'
                    },
                    {
                        id: 2,
                        title: 'Title 3',
                        content: 'Content 3'
                    }
                ],
                itemsChanged: function (selectedItems, allSelected) {
                    actualSelectedItems = selectedItems;
                    actualAllSelected = allSelected;
                }
            };
        });
        

        it('should transclude multiselect options', function () {
            var el;

            el = $compile(cardMultiselectHtml)($scope);

            $scope.$digest();
            expect(el.find('.bb-listbuilder-toolbar-summary-container .bb-listbuilder-toolbar-multiselect-container .bb-listbuilder-multiselect').length).toBe(1);
        });

        describe('card', function () {
            it('should call function when card is selected', function () {
                var el;

                el = initMultiselect(cardMultiselectHtml);

                clickCardCheckBox(el, 1);

                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([1]);

                clickCardCheckBox(el, 0);

                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([1, 0]);

                el.remove();
            });

            it('should call function when card is unselected', function () {
                var el;

                el = initMultiselect(cardMultiselectHtml);

                clickCardCheckBox(el, 0);

                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([0]);

                clickCardCheckBox(el, 0);

                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([]);

                el.remove();
            });

        });

        describe('repeater item', function () {
            it('should call function when repeater item is selected', function () {

            });

            it('should call function when repeater item is unselected', function () {

            });
        });

        describe('custom actions', function () {
            it('should call function when custom item is selected', function () {
                
                
            });

            it('should call function when custom item is unselected', function () {

            });
        });

        describe('select all', function () {
            it('should call function and update when select all is clicked', function () {
                var el;

                $scope.listCtrl.selectAll = function () {
                    $scope.listCtrl.data[0].selected = true;
                    $scope.listCtrl.data[1].selected = true;
                    $scope.listCtrl.data[2].selected = true;
                    return [0, 1, 2];
                };

                el = initMultiselect(cardMultiselectHtml);

                clickCardCheckBox(el, 1);
                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([1]);

                clickSelectAll(el);

                expect(actualAllSelected).toBe(true);
                expect(actualSelectedItems).toEqual([1, 0, 2]);

                clickCardCheckBox(el, 1);
                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([0, 2]);

                el.remove();

            });

            it('should call function and update when select all is clicked and returns a promise', function () {
                var el;

                $scope.listCtrl.selectAll = function () {
                    $scope.listCtrl.data[0].selected = true;
                    $scope.listCtrl.data[1].selected = true;
                    $scope.listCtrl.data[2].selected = true;
                    return {
                        then: function (callback) {
                            callback([0, 1, 2]);
                        }
                    };
                    
                };

                el = initMultiselect(cardMultiselectHtml);

                clickSelectAll(el);

                expect(actualAllSelected).toBe(true);
                expect(actualSelectedItems).toEqual([0, 1, 2]);

                clickCardCheckBox(el, 1);
                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([0, 2]);

                el.remove();
            });

            it('should not update selectedItems when nothing is returned', function () {
                var el;

                $scope.listCtrl.selectAll = function () {
                    
                };

                el = initMultiselect(cardMultiselectHtml);

                clickSelectAll(el);

                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([]);

                clickCardCheckBox(el, 1);
                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([1]);

                el.remove();
            });
        });

        describe('clear all', function () {
            it('should call function and update when clear all is clicked', function () {
                var el;

                $scope.listCtrl.clearAll = function () {
                    $scope.listCtrl.data[0].selected = false;
                    $scope.listCtrl.data[1].selected = false;
                    $scope.listCtrl.data[2].selected = false;
                    return {
                        then: function (callback) {
                            callback([0, 1, 2]);
                        }
                    };
                };

                el = initMultiselect(cardMultiselectHtml);

                clickCardCheckBox(el, 1);
                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([1]);

                clickClearAll(el);

                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([]);

                el.remove();
            });

            it('should call function and update when clear all is clicked and returns a promise', function () {
                var el;

                $scope.listCtrl.clearAll = function () {
                    $scope.listCtrl.data[0].selected = false;
                    $scope.listCtrl.data[1].selected = false;
                    $scope.listCtrl.data[2].selected = false;
                    return [0, 1, 2];
                };

                el = initMultiselect(cardMultiselectHtml);

                clickCardCheckBox(el, 1);
                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([1]);

                clickClearAll(el);

                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([]);

                el.remove();
            });

            it('should not update selectedItems when nothing is returned', function () {
                var el;

                $scope.listCtrl.clearAll = function () {
                    
                };

                el = initMultiselect(cardMultiselectHtml);

                clickClearAll(el);

                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([]);

                clickCardCheckBox(el, 1);
                expect(actualAllSelected).toBe(false);
                expect(actualSelectedItems).toEqual([1]);

                el.remove();
            });
        });

        it('should allow users to set selectedIds and then select a card', function () {
            var el;

            el = initMultiselect(cardMultiselectHtml);

            clickCardCheckBox(el, 1);
            expect(actualAllSelected).toBe(false);
            expect(actualSelectedItems).toEqual([1]);

            $scope.listCtrl.selectedIds = [0, 2];
            $scope.listCtrl.data[0].selected = true;
            $scope.listCtrl.data[1].selected = false;
            $scope.listCtrl.data[2].selected = true;

            $scope.$digest();

            clickCardCheckBox(el, 1);
            expect(actualAllSelected).toBe(false);
            expect(actualSelectedItems).toEqual([0, 2, 1]);

            el.remove();
        });

        it('should allow users to set selectedIds and then unselect a card', function () {
            var el;

            el = initMultiselect(cardMultiselectHtml);

            clickCardCheckBox(el, 1);
            expect(actualAllSelected).toBe(false);
            expect(actualSelectedItems).toEqual([1]);

            $scope.listCtrl.selectedIds = [0, 2];
            $scope.listCtrl.data[0].selected = true;
            $scope.listCtrl.data[1].selected = false;
            $scope.listCtrl.data[2].selected = true;

            $scope.$digest();

            clickCardCheckBox(el, 0);
            expect(actualAllSelected).toBe(false);
            expect(actualSelectedItems).toEqual([2]);

            el.remove();
        });

        it('should allow users to toggle a function when clicking the onlySelected input', function () {
            var el,
                actualShowOnlySelected;

            $scope.listCtrl.toggleOnlySelected = function (showOnlySelected) {
                actualShowOnlySelected = showOnlySelected;
            };

            el = initMultiselect(cardMultiselectHtml = angular.element(
                startMultiselectHtml +
                onlySelectedHtml +
                endMultiselectHtml +
                cardContentHtml));

            clickOnlySelected(el);

            expect(actualShowOnlySelected).toBe(true);

            clickOnlySelected(el);
            expect(actualShowOnlySelected).toBe(false);

            el.remove();
        });
        
    });

})();
