// dynamic adaptive
export function mediaAdaptive() {
    function DynamicAdapt(type) {
        this.type = type;
    }
    
    DynamicAdapt.prototype.init = function () {
        const _this = this;
        // массив объектов
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        // массив DOM-элементов
        this.nodes = document.querySelectorAll("[data-da]");
    
        // наполнение оbjects объктами
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
    
        this.arraySort(this.оbjects);
    
        // массив уникальных медиа-запросов
        this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
            return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }, this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        });
    
        // навешивание слушателя на медиа-запрос
        // и вызов обработчика при первом запуске
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ',');
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
    
            // массив объектов с подходящим брейкпоинтом
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
                return item.breakpoint === mediaBreakpoint;
            });
            matchMedia.addListener(function () {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            });
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    
    DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
        if (matchMedia.matches) {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            }
        } else {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                if (оbject.element.classList.contains(this.daClassname)) {
                    this.moveBack(оbject.parent, оbject.element, оbject.index);
                }
            }
        }
    };
    
    // Функция перемещения
    DynamicAdapt.prototype.moveTo = function (place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === 'last' || place >= destination.children.length) {
            destination.insertAdjacentElement('beforeend', element);
            return;
        }
        if (place === 'first') {
            destination.insertAdjacentElement('afterbegin', element);
            return;
        }
        destination.children[place].insertAdjacentElement('beforebegin', element);
    }
    
    // Функция возврата
    DynamicAdapt.prototype.moveBack = function (parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== undefined) {
            parent.children[index].insertAdjacentElement('beforebegin', element);
        } else {
            parent.insertAdjacentElement('beforeend', element);
        }
    }
    
    // Функция получения индекса внутри родителя
    DynamicAdapt.prototype.indexInParent = function (parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    
    // Функция сортировки массива по breakpoint и place 
    // по возрастанию для this.type = min
    // по убыванию для this.type = max
    DynamicAdapt.prototype.arraySort = function (arr) {
        if (this.type === "min") {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }
    
                    if (a.place === "first" || b.place === "last") {
                        return -1;
                    }
    
                    if (a.place === "last" || b.place === "first") {
                        return 1;
                    }
    
                    return a.place - b.place;
                }
    
                return a.breakpoint - b.breakpoint;
            });
        } else {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }
    
                    if (a.place === "first" || b.place === "last") {
                        return 1;
                    }
    
                    if (a.place === "last" || b.place === "first") {
                        return -1;
                    }
    
                    return b.place - a.place;
                }
    
                return b.breakpoint - a.breakpoint;
            });
            return;
        }
    };
    
    const da = new DynamicAdapt("max");
    da.init();
}

export function sortingProducts() {
    if (document.querySelector('.btn-chapter-sorting__adverts-products')) {
        let btnSortingDef = document.getElementById('btn-sorting-def');
        let btnSortingNew = document.getElementById('btn-sorting-new');
        let btnSortingMax = document.getElementById('btn-sorting-max');
        let btnSortingMin = document.getElementById('btn-sorting-min');

        const content_categorySorting = document.querySelector('.btn-sorting__adverts-products');
        const list_btnsSorting = document.querySelector('.list-sorting__adverts-products');

        btnSortingDef.addEventListener('click', function() {
            sortDesc('data-default');
            list_btnsSorting.insertBefore(content_categorySorting.children[0], list_btnsSorting[1]);
            content_categorySorting.insertBefore(btnSortingDef, content_categorySorting.children[0]);
        });
        btnSortingNew.addEventListener('click', function() {
            list_btnsSorting.insertBefore(content_categorySorting.children[0], list_btnsSorting[1]);
            content_categorySorting.insertBefore(btnSortingNew, content_categorySorting.children[0]);
            sortGrow('data-new');
        });
        btnSortingMax.addEventListener('click', function() {
            list_btnsSorting.insertBefore(content_categorySorting.children[0], list_btnsSorting[1]);
            content_categorySorting.insertBefore(btnSortingMax, content_categorySorting.children[0]);
            sortDesc('data-price');
        });
        btnSortingMin.addEventListener('click', function() {
            list_btnsSorting.insertBefore(content_categorySorting.children[0], list_btnsSorting[1]);
            content_categorySorting.insertBefore(btnSortingMin, content_categorySorting.children[0]);
            sortGrow('data-price');
        });

        // возрастание
        function sortGrow(sortType) {
            const parentsElementsSorting = document.querySelectorAll('.content-table-adverts');
            for (let index = 0; index < parentsElementsSorting.length; index++) {
                let elSorting = parentsElementsSorting[index];
                for (let i = 0; i < elSorting.children.length; i++) {
                    for (let j = i; j < elSorting.children.length; j++) {
                        if (+elSorting.children[i].getAttribute(sortType) > +elSorting.children[j].getAttribute(sortType)) {
                            // перезапись первого элемента
                            let replacedNode = elSorting.replaceChild(elSorting.children[j], elSorting.children[i]);
                            // вставка перезаписанного элемента
                            insertAfter(replacedNode, elSorting.children[i]);
                        }
                    }
                }
            }
        }
        // убывание
        function sortDesc(sortType) {
            const parentsElementsSorting = document.querySelectorAll('.content-table-adverts');
            for (let index = 0; index < parentsElementsSorting.length; index++) {
                let elSorting = parentsElementsSorting[index];
                for (let i = 0; i < elSorting.children.length; i++) {
                    for (let j = i; j < elSorting.children.length; j++) {
                        if (+elSorting.children[i].getAttribute(sortType) < +elSorting.children[j].getAttribute(sortType)) {
                            // перезапись первого элемента
                            let replacedNode = elSorting.replaceChild(elSorting.children[j], elSorting.children[i]);
                            // вставка перезаписанного элемента
                            insertAfter(replacedNode, elSorting.children[i]);
                        }
                    }
                }
            }
        }

        function insertAfter(elem, refElem) {
            return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
        }
    }
}