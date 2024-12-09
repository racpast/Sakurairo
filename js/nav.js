// 导航栏长度限制
    function initNavWidth() {
        const nav = document.querySelector('nav');
        const checkWidth = () => {
            if (nav.offsetWidth > 1200) {
                nav.style.overflowX = 'hidden';
                nav.style.maxWidth = '1200px';
            } else {
                nav.style.overflowX = '';
                nav.style.maxWidth = '';
            }
        };
        checkWidth();
        window.addEventListener('resize', checkWidth);
    }

    document.addEventListener('DOMContentLoaded', initNavWidth);
    document.addEventListener('pjax:complete', initNavWidth);

// 定义DOM元素
const DOM = {
    bgNext: document.getElementById("bg-next"),
    navSearchWrapper: document.querySelector(".nav-search-wrapper"),
    searchbox: document.querySelector(".searchbox.js-toggle-search"),
    divider: document.querySelector(".nav-search-divider"),
};

// 定义动画参数
const ANIMATION = {
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    duration: "0.6s",
    durationMs: 600,
};

// 改进的状态管理器
const StateManager = {
    init() {
        try {
            if (sessionStorage.getItem("bgNextState")) {
                return this.getState();
            }
            const state = {
                lastPageWasHome: false,
                isTransitioning: false,
                firstLoad: true,
                initialized: false,
                firstHomeTransition: true, // 新增：追踪第一次主页过渡
                initializedOutsideHome: false // 新增：追踪是否在非主页完成初始化
            };
            this.setState(state);
            return state;
        } catch (e) {
            console.warn('StateManager initialization failed:', e);
            return {
                lastPageWasHome: false,
                isTransitioning: false,
                firstLoad: true,
                initialized: false,
                firstHomeTransition: true,
                initializedOutsideHome: false
            };
        }
    },

    getState() {
        return JSON.parse(sessionStorage.getItem("bgNextState"));
    },

    setState(state) {
        sessionStorage.setItem("bgNextState", JSON.stringify(state));
    },

    update(changes) {
        this.setState({
            ...this.getState(),
            ...changes,
        });
    },
    
    clear() {
        sessionStorage.removeItem("bgNextState");
    },
};

// 设置动画过渡
const setTransitions = () => {
    DOM.bgNext.style.transition = `all ${ANIMATION.duration} ${ANIMATION.easing}`;
    DOM.navSearchWrapper.style.transition = `all ${ANIMATION.duration} ${ANIMATION.easing}`;

    if (DOM.searchbox) {
        DOM.searchbox.style.transition = `transform ${ANIMATION.duration} ${ANIMATION.easing}`;
    }

    if (DOM.divider) {
        DOM.divider.style.transition = !DOM.searchbox
            ? `all ${ANIMATION.duration} ${ANIMATION.easing}`
            : `transform ${ANIMATION.duration} ${ANIMATION.easing}`;
    }
};

// 初始化元素状态 - 优化后的版本
const initElementStates = (isEntering, bgNextWidth, initialWidth, isFirstLoad = false) => {
    // 确保元素可见性和位置重置
    const resetElement = (element, styles) => {
        if (element) {
            element.style.cssText = styles;
            // 强制重绘
            void element.offsetWidth;
        }
    };

    // 重置所有元素的过渡
    [DOM.bgNext, DOM.navSearchWrapper, DOM.searchbox, DOM.divider].forEach(el => {
        if (el) el.style.transition = 'none';
    });

    // 初始化导航容器宽度 - 移除overflow设置
    resetElement(DOM.navSearchWrapper, `
        width: ${initialWidth}px;
    `);

    // 初始化 bg-next 元素
    resetElement(DOM.bgNext, `
        display: block;
        opacity: ${isEntering ? "0" : "1"};
        transform: translateX(${isEntering ? "20px" : "0"});
        pointer-events: auto;
        position: relative;
        z-index: 1;
        transition: none;
    `);

    if (!DOM.searchbox && DOM.divider) {
        if (isEntering && !isFirstLoad) {
            resetElement(DOM.divider, `
                display: block;
                opacity: 0;
                transform: translateX(${isEntering ? "20px" : "0"});
                transition: none;
            `);
        }
    }

    if (isEntering && !isFirstLoad) {
        setInitialPositions(bgNextWidth);
    }

    // 强制重绘所有元素
    requestAnimationFrame(() => {
        [DOM.bgNext, DOM.navSearchWrapper, DOM.searchbox, DOM.divider].forEach(el => {
            if (el) void el.offsetWidth;
        });
    });
};

// 设置初始位置
const setInitialPositions = (bgNextWidth) => {
    if (DOM.searchbox) {
        DOM.searchbox.style.cssText = `
            transform: translateX(${bgNextWidth}px);
            transition: none;
        `;
    }
    if (DOM.divider) {
        if (!DOM.searchbox) {
            DOM.divider.style.cssText = `
                display: block;
                opacity: 0;
                transform: translateX(${bgNextWidth}px);
                transition: none;
            `;
        } else {
            DOM.divider.style.cssText = `
                transform: translateX(${bgNextWidth}px);
                transition: none;
            `;
        }
    }
};

// 优化的动画执行函数
const animateElements = (isEntering, bgNextWidth, initialWidth) => {
    // 使用 transform 代替 width 动画以提高性能
    const animate = () => {
        setTransitions();
        
        // 优化动画性能
        DOM.navSearchWrapper.style.willChange = 'transform, width';
        DOM.bgNext.style.willChange = 'transform, opacity';
        DOM.bgNext.style.pointerEvents = 'auto';
        DOM.bgNext.style.zIndex = '1';
        
        if (DOM.searchbox) DOM.searchbox.style.willChange = 'transform';
        if (DOM.divider) DOM.divider.style.willChange = 'transform, opacity';

        // 确保在动画开始前overflow为hidden
        if (!window._searchWrapperState || !window._searchWrapperState.state) {
            DOM.navSearchWrapper.style.overflow = "hidden";
        }

        const elements = [
            [DOM.bgNext, {
                opacity: isEntering ? "1" : "0",
                transform: `translateX(${isEntering ? "0" : "20px"})`
            }],
            [DOM.navSearchWrapper, {
                width: `${initialWidth + (isEntering ? bgNextWidth : -bgNextWidth)}px`
            }]
        ];

        if (!isEntering) {
            if (DOM.searchbox) {
                elements.push([DOM.searchbox, {
                    transform: `translateX(${bgNextWidth}px)` // 直接使用bgNextWidth
                }]);
            }
            if (DOM.divider) {
                elements.push([DOM.divider, {
                    opacity: DOM.searchbox ? "1" : "0",
                    transform: `translateX(${bgNextWidth}px)` // 直接使用bgNextWidth
                }]);
            }
        } else {
            if (DOM.searchbox) {
                elements.push([DOM.searchbox, {
                    transform: "translateX(0)"
                }]);
            }
            if (DOM.divider) {
                elements.push([DOM.divider, {
                    opacity: "1",
                    transform: "translateX(0)"
                }]);
            }
        }

        // 移除之前的transitionend事件，改为仅在动画完成后处理
        setTimeout(() => {
            DOM.navSearchWrapper.style.willChange = '';
            DOM.bgNext.style.willChange = '';
            DOM.bgNext.style.pointerEvents = 'auto'; // 确保动画结束后仍可点击
            if (DOM.searchbox) DOM.searchbox.style.willChange = '';
            if (DOM.divider) DOM.divider.style.willChange = '';
            
            // 仅在非文章标题切换状态时重置overflow
            if (!window._searchWrapperState || !window._searchWrapperState.state) {
                requestAnimationFrame(() => {
                    DOM.navSearchWrapper.style.overflow = "unset";
                });
            }
        }, ANIMATION.durationMs);

        elements.forEach(([element, styles]) => {
            if (element) {
                Object.assign(element.style, styles);
            }
        });
    };

    // 使用 RAF 确保动画流畅
    requestAnimationFrame(animate);
};

// 页面过渡处理
const handlePageTransition = (isHomePage, state) => {
    // 添加清理逻辑
    const cleanupAnimations = () => {
        if (window._searchWrapperState) {
            window._searchWrapperState.state = false;
            if (window._searchWrapperState.hideTimeout) {
                clearTimeout(window._searchWrapperState.hideTimeout);
            }
            if (window._searchWrapperState.scrollRAF) {
                cancelAnimationFrame(window._searchWrapperState.scrollRAF);
            }
        }
        
        // 重置导航样式
        DOM.navSearchWrapper.style.overflow = "unset";
        DOM.navSearchWrapper.style.width = "auto";
        delete DOM.navSearchWrapper.dataset.scrollswap;
        DOM.navSearchWrapper.style.setProperty("--dw", "0");

        if (isHomePage) {
            // 确保在主页时 bg-next 可点击
            DOM.bgNext.style.pointerEvents = 'auto';
            DOM.bgNext.style.zIndex = '1';
        }
    };

    if (isHomePage === state.lastPageWasHome) {
        cleanupAnimations();
        DOM.bgNext.style.display = isHomePage ? "block" : "none";
        return;
    }

    // 使用 Performance API 优化动画时机
    if (window.performance && window.performance.now) {
        const startTime = performance.now();
        
        // 添加防抖，避免快速切换导致的动画问题
        if (state.transitionTimer) {
            cancelAnimationFrame(state.transitionTimer);
        }

        state.transitionTimer = requestAnimationFrame(async () => {
            // 确保在非主页初始化后首次进入主页时重新初始化
            if (isHomePage && state.initializedOutsideHome && !InitController.initialized) {
                await InitController.init();
            }
            
            if (!InitController.initialized) {
                await InitController.init();
            }
            
            const getMeasuredWidth = (element) => {
                return new Promise(resolve => {
                    const clone = element.cloneNode(true);
                    clone.style.cssText = `
                        all: initial !important;
                        position: fixed !important;
                        visibility: hidden !important;
                        display: block !important;
                        max-width: none !important;
                        width: auto !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: ${getComputedStyle(element).padding} !important;
                        font: ${getComputedStyle(element).font} !important;
                    `;
                    
                    requestAnimationFrame(() => {
                        document.body.appendChild(clone);
                        requestAnimationFrame(() => {
                            const width = clone.getBoundingClientRect().width;
                            document.body.removeChild(clone);
                            resolve(Math.ceil(width));
                        });
                    });
                });
            };

            try {
                const isWebKit = BrowserDetect.isWebKit();
                const originalDisplay = DOM.bgNext.style.display;
                
                // 临时隐藏所有可能影响宽度的元素
                DOM.bgNext.style.display = 'none';
                if (DOM.searchbox) DOM.searchbox.style.visibility = 'hidden';
                if (DOM.divider) DOM.divider.style.visibility = 'hidden';
                
                let wrapperWidth = Math.ceil(DOM.navSearchWrapper.getBoundingClientRect().width);
                
                // 恢复元素显示
                DOM.bgNext.style.display = originalDisplay;
                if (DOM.searchbox) DOM.searchbox.style.visibility = '';
                if (DOM.divider) DOM.divider.style.visibility = '';
                
                const bgWidth = await WidthCalculator.measure(DOM.bgNext, {
                    useCache: true,
                    additionalStyles: 'margin: 0 !important; padding: inherit !important;'
                });
                
                const gap = parseFloat(getComputedStyle(DOM.navSearchWrapper).gap) || 0;
                const finalBgWidth = Math.ceil(bgWidth + gap);
                
                // 只在非主页的WebKit环境下补充宽度
                if (isWebKit && !isHomePage) {
                    wrapperWidth = Math.ceil(wrapperWidth + finalBgWidth);
                }
                
                animateTransition(isHomePage, state, finalBgWidth, wrapperWidth);
            } catch (error) {
                console.error('过渡失败:', error);
                cleanupAnimations();
            }
        });
    }
};

// 执行过渡动画
const animateTransition = (isEntering, state, bgNextWidth, initialWidth) => {
    if (state.isTransitioning) return;

    StateManager.update({
        isTransitioning: true,
    });

    // 使用存储的测量宽度进行验证和修正
    if (state.measuredWidths) {
        const currentInitialWidth = Math.ceil(DOM.navSearchWrapper.getBoundingClientRect().width);
        // 修复：如果是第一次执行退出动画且当前是主页，初始宽度需要减去一个 bgNextWidth
        if (!state.firstExitDone && !isEntering && location.pathname === "/") {
            initialWidth -= bgNextWidth;
            state.firstExitDone = true;
            StateManager.setState(state);
        }
        // 检查宽度差异
        if (Math.abs(currentInitialWidth - state.measuredWidths.initial) > 5) {
            console.debug('Width mismatch detected, recalculating...');
            initialWidth = currentInitialWidth;
        }
    }

    initElementStates(isEntering, bgNextWidth, initialWidth);

    [DOM.bgNext, DOM.navSearchWrapper, DOM.searchbox, DOM.divider].forEach((el) => {
        if (el) void el.offsetWidth;
    });

    requestAnimationFrame(() => {
        setTransitions();
        animateElements(isEntering, bgNextWidth, initialWidth);

        // 修改动画完成后的处理
        setTimeout(() => {
            if (!isEntering) {
                DOM.bgNext.style.display = "none";
                DOM.navSearchWrapper.style.width = "auto";
                // 确保在non-home页面时正确设置overflow
                if (!window._searchWrapperState || !window._searchWrapperState.state) {
                    DOM.navSearchWrapper.style.overflow = "unset";
                }
                if (!DOM.searchbox && DOM.divider) {
                    DOM.divider.style.display = "none";
                }
                [DOM.searchbox, DOM.divider].forEach((el) => {
                    if (el) {
                        el.style.transition = "none";
                        el.style.transform = "";
                    }
                });
            }
            StateManager.update({
                isTransitioning: false,
            });
        }, ANIMATION.durationMs);
    });
};

// 显示或隐藏bgNext元素 - 优化后的版本
const showBgNext = async () => {
    const isHomePage =
        location.pathname === "/" || location.pathname === "/index.php";
    const state = StateManager.getState();

    if (state.isTransitioning) {
        // 即使在过渡状态，也要确保在主页时 bg-next 可点击
        if (isHomePage) {
            DOM.bgNext.style.pointerEvents = 'auto';
            DOM.bgNext.style.zIndex = '1';
        }
        return;
    }

    // 处理首次加载非主页的情况
    if (!state.initialized && !isHomePage) {
        state.initializedOutsideHome = true;
        state.initialized = true;
        StateManager.setState(state);
        DOM.bgNext.style.display = 'none';
        return;
    }

    // 处理从非主页首次回到主页的情况
    if (isHomePage && state.initializedOutsideHome && state.firstHomeTransition) {
        try {
            const widths = await InitController.init();
            if (!widths) return;

            state.firstHomeTransition = false;
            state.measuredWidths = widths;
            StateManager.setState(state);

            // 设置初始状态
            initElementStates(true, widths.bgNextWidth, widths.wrapperWidth, false);
            
            // 使用 RAF 链确保动画正确执行
            requestAnimationFrame(() => {
                DOM.bgNext.style.opacity = '0';
                DOM.bgNext.style.transform = 'translateX(20px)';
                DOM.bgNext.style.display = 'block';
                
                requestAnimationFrame(() => {
                    setTransitions();
                    animateElements(true, widths.bgNextWidth, widths.wrapperWidth);
                });
            });
            return;
        } catch (error) {
            console.error('主页初始化失败:', error);
            state.firstHomeTransition = false;
            StateManager.setState(state);
            return;
        }
    }

    // 处理常规的首页首次加载
    if (state.firstLoad && !state.initialized && isHomePage) {
        try {
            const widths = await InitController.init();
            if (!widths) return;
            
            // 确保DOM已准备就绪
            await new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve, { once: true });
                }
            });
            
            state.initialized = true;
            state.measuredWidths = widths;
            StateManager.setState(state);
            
            // 使用RAF链执行初始动画
            requestAnimationFrame(() => {
                initElementStates(true, widths.bgNextWidth, widths.wrapperWidth, true);
                state.firstLoad = false;
                StateManager.setState(state);
                
                requestAnimationFrame(() => {
                    animateElements(true, widths.bgNextWidth, widths.wrapperWidth);
                });
            });
        } catch (error) {
            console.error('初始化失败:', error);
            state.firstLoad = false;
            StateManager.setState(state);
        }
        return;
    }

    handlePageTransition(isHomePage, state);
};

// 初始化文章标题行为
const initArticleTitleBehavior = () => {
    DOM.navSearchWrapper.style.overflow = "unset";

    if (window._searchWrapperState) {
        const navTitle = DOM.navSearchWrapper.querySelector(".nav-article-title");
        if (navTitle) {
            navTitle.remove();
        }
        delete DOM.navSearchWrapper.dataset.scrollswap;
        DOM.navSearchWrapper.style.setProperty("--dw", "0");
        window._searchWrapperState = null;
    }

    if (!_iro.land_at_home) {
        const searchWrapperState = {
            state: false,
            navElement: null,
            navTitle: null,
            entryTitle: null,
            titlePadding: 20,
            scrollTimeout: null,
            hideTimeout: null,
            headerElement: null,

            init() {
                this.navTitle = DOM.navSearchWrapper.querySelector(".nav-article-title");
                this.entryTitle = document.querySelector(".entry-title");
                this.navElement = DOM.navSearchWrapper.querySelector("nav");
                this.header = document.querySelector("header");

                if (!this.navTitle) {
                    this.navTitle = document.createElement("div");
                    this.navTitle.classList.add("nav-article-title");
                    this.navTitle.style.opacity = "0";
                    DOM.navSearchWrapper.firstElementChild.insertAdjacentElement(
                        "afterend",
                        this.navTitle
                    );

                    this.header.addEventListener("mouseenter", () => {
                        if (this.hideTimeout) {
                            clearTimeout(this.hideTimeout);
                            this.hideTimeout = null;
                        }
                        if (this.entryTitle && this.entryTitle.getBoundingClientRect().top < 0) {
                            this.hide();
                        }
                    });

                    this.header.addEventListener("mouseleave", () => {
                        if (this.hideTimeout) {
                            clearTimeout(this.hideTimeout);
                        }
                        if (this.entryTitle && this.entryTitle.getBoundingClientRect().top < 0) {
                            this.hideTimeout = setTimeout(() => {
                                this.show();
                                this.hideTimeout = null;
                            }, 3000);
                        }
                    });

                    this.navElement.addEventListener("transitionend", (event) => {
                        if (event.target !== this.navElement && event.target !== this.header) return;
                        this.navTitle.style.opacity = window.getComputedStyle(this.navElement).transform == "none" ? "0" : "1";
                        if (document.querySelector(".entry-title")) {
                            DOM.navSearchWrapper.style.overflow = window.getComputedStyle(this.navElement).transform === "none" ? "unset" : "hidden";
                        }
                    });

                    this.navElement.addEventListener("transitionstart", (event) => {
                        if (event.target !== this.navElement && event.target !== this.header) return;
                        if (document.querySelector(".entry-title")) {
                            DOM.navSearchWrapper.style.overflow = "hidden";
                        }
                        this.navTitle.style.opacity = "1";
                    });
                }
                this.updateTitle();
            },

            updateTitle() {
                if (this.entryTitle) {
                    this.navTitle.textContent = this.entryTitle.textContent;
                    this.navTitle.style.display = "block";
                } else {
                    this.navTitle.style.display = "none";
                }
            },

            show() {
                if (this.state || !this.entryTitle) return;
                const navSearchWrapper = DOM.navSearchWrapper;
                navSearchWrapper.dataset.scrollswap = "true";

                requestAnimationFrame(() => {
                    // 创建临时导航容器
                    const tempNav = document.createElement('div');
                    tempNav.style.cssText = `
                        position: absolute;
                        visibility: hidden;
                        white-space: nowrap;
                        display: flex;
                        align-items: center;
                        padding: ${window.getComputedStyle(this.navElement).padding};
                        margin: ${window.getComputedStyle(this.navElement).margin};
                        gap: ${window.getComputedStyle(this.navElement).gap};
                    `;
                    document.body.appendChild(tempNav);

                    // 克隆导航项并保持完整样式
                    const menuItems = Array.from(this.navElement.children);
                    menuItems.forEach(item => {
                        const clone = item.cloneNode(true);
                        const computedStyle = window.getComputedStyle(item);
                        clone.style.cssText = Array.from(computedStyle).reduce((str, prop) => {
                            return `${str}${prop}:${computedStyle.getPropertyValue(prop)};`;
                        }, '');
                        tempNav.appendChild(clone);
                    });
                    
                    const actualNavWidth = Math.ceil(tempNav.getBoundingClientRect().width);
                    
                    // 创建临时标题容器
                    const tempTitle = document.createElement('div');
                    const titleStyle = window.getComputedStyle(this.navTitle);
                    tempTitle.style.cssText = `
                        position: absolute;
                        visibility: hidden;
                        white-space: nowrap;
                        font-size: ${titleStyle.fontSize};
                        font-family: ${titleStyle.fontFamily};
                        font-weight: ${titleStyle.fontWeight};
                        letter-spacing: ${titleStyle.letterSpacing};
                        padding: ${titleStyle.padding};
                        margin: ${titleStyle.margin};
                    `;
                    tempTitle.textContent = this.navTitle.textContent;
                    document.body.appendChild(tempTitle);
                    
                    const actualTitleWidth = Math.ceil(tempTitle.getBoundingClientRect().width);
                    
                    // 直接使用宽度差值，不再添加补偿空间
                    const deltaWidth = actualTitleWidth - actualNavWidth;
                    
                    navSearchWrapper.style.setProperty("--dw", `${deltaWidth}px`);

                    // 清理临时元素
                    document.body.removeChild(tempNav);
                    document.body.removeChild(tempTitle);
                });
                this.state = true;
            },

            hide() {
                if (!this.state) return;
                const navSearchWrapper = DOM.navSearchWrapper;
                delete navSearchWrapper.dataset.scrollswap;
                navSearchWrapper.style.setProperty("--dw", "0");
                if (document.querySelector(".entry-title")) {
                    navSearchWrapper.style.overflow = "unset";
                }
                this.state = false;
            },

            handleScroll() {
                // 使用 RAF 优化滚动性能
                if (!this.scrollRAF) {
                    this.scrollRAF = requestAnimationFrame(() => {
                        if (this.entryTitle) {
                            const rect = this.entryTitle.getBoundingClientRect();
                            if (rect.top < 0) {
                                this.show();
                            } else {
                                this.hide();
                            }
                        }
                        this.scrollRAF = null;
                    });
                }
            },
        };

        searchWrapperState.init();

        const scrollHandler = () => searchWrapperState.handleScroll();
        window.addEventListener("scroll", scrollHandler, { passive: true });
        window.addEventListener("resize", () => searchWrapperState.show(), {
            passive: true,
        });

        scrollHandler();

        window._searchWrapperState = searchWrapperState;
    } else {
        requestAnimationFrame(() => {
            DOM.navSearchWrapper.style.overflow = "unset";
        });
    }
};

// 初始化所有动画
const initAnimations = () => {
    StateManager.init();
    showBgNext();
    initArticleTitleBehavior();
};

// 优化的事件监听器
const addEventListeners = () => {
    const events = [
        ["pjax:send", () => {
            WidthCalculator.clearCache();
            // 清理之前的动画状态
            if (window._searchWrapperState) {
                if (window._searchWrapperState.hideTimeout) {
                    clearTimeout(window._searchWrapperState.hideTimeout);
                }
                if (window._searchWrapperState.scrollRAF) {
                    cancelAnimationFrame(window._searchWrapperState.scrollRAF);
                }
                window._searchWrapperState.state = false;
            }
            
            StateManager.update({
                lastPageWasHome: location.pathname === "/" || location.pathname === "/index.php",
                isTransitioning: false // 强制重置过渡状态
            });
        }],
        ["pjax:complete", () => {
            requestAnimationFrame(() => {
                // 确保所有状态重置
                DOM.navSearchWrapper.style.overflow = "unset";
                DOM.navSearchWrapper.style.width = "auto";
                delete DOM.navSearchWrapper.dataset.scrollswap;
                DOM.navSearchWrapper.style.setProperty("--dw", "0");
                
                showBgNext();
                if (window._searchWrapperState) {
                    window._searchWrapperState.init();
                    window._searchWrapperState.handleScroll();
                } else {
                    initArticleTitleBehavior();
                }
            });
        }],
        ["DOMContentLoaded", initAnimations]
    ];

    events.forEach(([event, handler]) => {
        document.addEventListener(event, handler);
    });
};

// 初始化时调用事件监听器设置
addEventListeners();

// 新增宽度测量工具
const WidthCalculator = {
    cache: new Map(),
    
    async measure(element, options = {}) {
        if (!element) return 0;
        
        const cacheKey = element.id || element.className;
        if (options.useCache && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const clone = element.cloneNode(true);
        clone.style.cssText = `
            position: fixed !important;
            visibility: hidden !important;
            display: block !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
            z-index: -9999 !important;
            ${options.additionalStyles || ''}
        `;
        
        document.body.appendChild(clone);
        
        // 等待几帧以确保样式应用完成
        await new Promise(resolve => {
            let frames = 3;
            function waitFrames() {
                if (--frames <= 0) {
                    resolve();
                } else {
                    requestAnimationFrame(waitFrames);
                }
            }
            requestAnimationFrame(waitFrames);
        });

        const rect = clone.getBoundingClientRect();
        const width = Math.ceil(rect.width);
        
        document.body.removeChild(clone);
        
        if (options.useCache) {
            this.cache.set(cacheKey, width);
        }
        
        return width;
    },

    clearCache() {
        this.cache.clear();
    }
};

// 新增初始化控制器
const InitController = {
    initialized: false,
    initializing: false,
    queue: [],
    
    async init() {
        if (this.initialized || this.initializing) return;
        this.initializing = true;
        
        // 确保字体加载完成
        await document.fonts.ready;
        // 增加延迟确保布局稳定
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 强制重新布局并测量
        const measure = async () => {
            // 保存原始状态
            const originalStyles = {
                wrapper: DOM.navSearchWrapper.style.cssText,
                bgNext: DOM.bgNext.style.cssText,
                searchbox: DOM.searchbox ? DOM.searchbox.style.cssText : '',
                divider: DOM.divider ? DOM.divider.style.cssText : ''
            };
            
            // 重置所有样式以获取准确测量
            DOM.navSearchWrapper.style.cssText = `
                overflow: hidden !important;
                width: auto !important;
                transition: none !important;
                transform: none !important;
            `;
            
            DOM.bgNext.style.cssText = `
                display: none !important;
                transition: none !important;
                transform: none !important;
            `;
            
            if (DOM.searchbox) DOM.searchbox.style.visibility = 'hidden';
            if (DOM.divider) DOM.divider.style.visibility = 'hidden';
            
            // 强制重排
            void DOM.navSearchWrapper.offsetWidth;
            
            // 获取基础宽度
            let wrapperWidth = Math.ceil(DOM.navSearchWrapper.getBoundingClientRect().width);
            
            // 测量 bg-next
            DOM.bgNext.style.cssText = `
                position: relative !important;
                visibility: visible !important;
                display: block !important;
                opacity: 0 !important;
                transform: none !important;
                transition: none !important;
            `;
            
            void DOM.bgNext.offsetWidth;
            
            const bgWidth = Math.ceil(DOM.bgNext.getBoundingClientRect().width);
            const gap = parseFloat(getComputedStyle(DOM.navSearchWrapper).gap) || 0;
            const finalBgWidth = Math.ceil(bgWidth + gap);
            
            // 恢复原始样式
            DOM.navSearchWrapper.style.cssText = originalStyles.wrapper;
            DOM.bgNext.style.cssText = originalStyles.bgNext;
            if (DOM.searchbox) DOM.searchbox.style.cssText = originalStyles.searchbox;
            if (DOM.divider) DOM.divider.style.cssText = originalStyles.divider;
            
            return {
                bgNextWidth: finalBgWidth,
                wrapperWidth: wrapperWidth
            };
        };
        
        const measurements = await measure();
        
        // 二次确认测量
        await new Promise(resolve => requestAnimationFrame(resolve));
        const secondMeasure = await measure();
        
        // 如果两次测量差异过大，使用第二次的结果
        const finalMeasurements = {
            bgNextWidth: Math.abs(measurements.bgNextWidth - secondMeasure.bgNextWidth) > 2 
                ? secondMeasure.bgNextWidth 
                : measurements.bgNextWidth,
            wrapperWidth: Math.abs(measurements.wrapperWidth - secondMeasure.wrapperWidth) > 2
                ? secondMeasure.wrapperWidth
                : measurements.wrapperWidth
        };
        
        this.initialized = true;
        this.initializing = false;
        
        return finalMeasurements;
    }
};

// 添加浏览器检测工具
const BrowserDetect = {
    isWebKit: () => {
        return 'WebkitAppearance' in document.documentElement.style;
    }
};