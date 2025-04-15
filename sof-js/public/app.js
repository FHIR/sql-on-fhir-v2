htmx.defineExtension('multiply', {
    init: function (api) {
        console.log('multiply init', api)
    },
    onEvent: function (name, e) {
        if (e.type == 'htmx:afterProcessNode') {
            const target = e.target;
            if (target) {
                target.addEventListener('click', (e) => {
                    const row = htmx.closest(target, '.multiply-row');
                    if (row) {
                        const clone = row.cloneNode(true);
                        row.parentNode.insertBefore(clone, row.nextSibling);
                        htmx.process(clone)
                    }
                })
            }
        }
    }
})

htmx.defineExtension('remove', {
    init: function (api) {
        console.log('remove init', api)
    },
    onEvent: function (name, e) {
        if (e.type == 'htmx:afterProcessNode') {
            const target = e.target;
            if (target) {
                target.addEventListener('click', (e) => {
                    const row = htmx.closest(target, '.remove-row');
                    if (row) {
                        row.remove()
                    }
                })
            }
        }
    }
})      