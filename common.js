async function checkFileAccess() {
    function htmlToElement(html) {
        const range = document.createRange();
        range.selectNode(document.body);
        return range.createContextualFragment(html).firstElementChild;
    }

    const onError = function () {
        const bootstrapContainer = document.getElementsByClassName('container');
        const container = bootstrapContainer.length ? bootstrapContainer[0] : document.body;
        container.insertAdjacentElement('afterbegin', htmlToElement(`
    <div style="color: red; font-size: 20px; margin: 40px 0;">
        <p>Failed to access data files. Are you trying to open this page as a local HTML file?</p>
        <p>Use a web server (such as <code class="code">npm install -g http-server</code> and run <code class="code">http-server</code>)
            or go to <a href="https://alexp11223.github.io/D3FlightsDataVisualization/">https://alexp11223.github.io/D3FlightsDataVisualization/</a>
        </p>
    </div>`));
    };
    try {
        await d3.json('data/months.json');
    } catch (e) {
        onError();
        throw e;
    }
}

$(function() {
    $('[data-toggle="tooltip"]').tooltip();

    $('.code-spoiler .collapse').each((i, element) => {
        const id = `codeSpoiler${i}`;
        $(element).attr('id', id);
        $(element).siblings('a').attr('href', `#${id}`);
    })
});