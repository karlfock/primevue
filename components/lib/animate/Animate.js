import { DomHandler } from 'primevue/utils';
import BaseAnimate from './BaseAnimate';

const Animate = BaseAnimate.extend('animate', {
    mounted(el, binding) {
        el.setAttribute('data-pd-animate', true);
        !this.isUnstyled() && DomHandler.addClass(el, 'p-animate');

        this.bindIntersectionObserver(el, binding);
    },
    unmounted(el) {
        this.unbindIntersectionObserver(el);
        clearTimeout(this.timeout);
    },
    timeout: null,
    observer: null,
    methods: {
        bindIntersectionObserver(el, binding) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 1.0
            };

            this.observer = new IntersectionObserver((element) => this.isVisible(element, el, binding), options);
            this.observer.observe(el);
        },
        isVisible(target, el, binding) {
            const [intersectionObserverEntry] = target;

            intersectionObserverEntry.isIntersecting ? this.enter(el, binding) : this.leave(el, binding);
        },
        enter(el, binding) {
            el.style.visibility = 'visible';
            DomHandler.addClass(el, binding.value.enterClass);
        },
        leave(el, binding) {
            DomHandler.removeClass(el, binding.value.enterClass);

            if (binding.value.leaveClass) {
                DomHandler.addClass(el, binding.value.leaveClass);
            }

            const animationDuration = el.style.animationDuration || 500;

            this.timeout = setTimeout(() => {
                el.style.visibility = 'hidden';
            }, animationDuration);
        },
        unbindIntersectionObserver(el) {
            if (this.observer) {
                this.observer.unobserve(el);
            }
        }
    }
});

export default Animate;
