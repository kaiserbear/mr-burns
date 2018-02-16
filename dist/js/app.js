/*********

TODO:

- Model JSON data with Monty CMS team

NOTES:

// 'opener' is a method in which we retrieve information about the previous window.
// srcHtml is the returning 'string' value from the Flex 'HTML' box. (assuming an exposed method, not sure how this works).

Try the below in your console when launching the editor

1. opener.srcHtml
2. opener.pageAssetsURLPrefix - returns 'http://ecmcstg.arcadiagroup.ltd.uk/cms/topshop_uk/repository/pages/json/json-0000009828'
3. opener.pageAssets[3].children.list.source[0].relativePath - should return a string like "/images/DENIM-BACK-GIRLFRIEND.jpg"

2 + 3 = Constructed image path.

.children.list.source[0].relativePath

*********/

const saveBtn = document.getElementById("save");
const cancelBtn = document.getElementById("cancel");
const generatebtn = document.getElementById('code-preview');
const imageSelect = document.getElementById("image-select");
const imagePreview = document.getElementById("image-preview");


var data;
var assets;
var store;
var dir;
var images;
var storeNiceName;


var $editor = $('#editor');


//////////////////////////////////////////////////////////////////////////////////


var useMockData = function() {
    temporaryData();
    dir = "http://localhost:3000/dist";
    store = tempUrl.split('/')[4];
    assets = temporaryImageData().pageAssets;
    data.store = store;
    storeNiceName = store.substr(0, store.lastIndexOf('_'));
}

function applyStoreImg() {
    var storeImg = document.getElementById('store-name');
    if (storeImg) {
        storeImg.src = "/dist/images/" + storeNiceName + ".png";
    }
}

//////////////////////////////////////////////////////////////////////////////////


// 1. Check if ECMC is present.

function checkECMC() {

    // If ECMC is not present
    if (opener === null) {
        // TODO: Another check to see if developer is working locally.
        useMockData();
        saveBackToECMC();
        applyStoreImg();
    }
    // If ECMC is present
    else {
        this.checkData = function() {
            if (opener.srcHtml != "") {
                data = JSON.parse(opener.srcHtml);
            }
            else {
                // Temporary For Now
                useMockData();
            }
        }
        this.getECMCAssets = function() {
            dir = opener.pageAssets;
            store = opener.pageAssetsURLPrefix.split('/')[4];
            assets = opener.pageAssets;
            data.store = store;
        }

        return checkData() + getECMCAssets() + saveBackToECMC()
    }
}

checkECMC();

///////////////////////////////////////////////////////////////////////////////

// 2. Check for uploaded images

function ReturnImages() {

    this.findImageList = function() {
        if (assets != null) {
            for (i = 0; i < assets.length; i++) {
                var imageAssets = assets[i];
                if (imageAssets.name === 'images') {
                    images = true;
                    return imageAssets;
                }
            }
        }
    }

    this.getEachImage = function() {

        // Needs refactoring when we know what to do with a list of images


        // If we have images, and somewhere to put them...

        if (images && imageSelect) {

            imageObj = findImageList().children.source;

            for (i = 0; i < imageObj.length; i++) {
                var path = imageObj[i].relativePath;
                var name = imageObj[i].name;

                // Assigning the images to a dropdown, temporary
                var eachImageOption = document.createElement('option');
                var text = document.createTextNode(name);
                eachImageOption.appendChild(text);
                imageSelect.appendChild(eachImageOption);

                if (imagePreview) {
                    eachImageOption.setAttribute('data-image', dir + path);
                }
            }
        }
    }

    return findImageList() + getEachImage()

}

ReturnImages();

////////////////////////////////////////////////////////////////////////////////

// 3. Do some basic routing if the returned data is lengthy, i.e. existed.

function routing(component) {

    var newCompBtn = document.getElementById('new-comp-btn');

    // If the component is known, and we haven't directed.
    if (component && !location.href.match(/return/)) {
        window.location.replace('/components/' + component + '.html?return');
    }

    // We've already directed, and the component exists.
    else if (component && newCompBtn) {
        newCompBtn.style.display = "block";
    }

    // If the component isn't known, assume it's new
    else if (component === "" && newCompBtn) {
        newCompBtn.style.display = "none";
        // generatebtn.style.display = "none";
    }

}

routing(data.component);

////////////////////////////////////////////////////////////////////////////////

// Froala WYSIWYG Editor

if ($editor.length) {
    $(function() {
        var toolbarButtons = ['bold', 'italic', 'underline', 'fontSize', 'color', 'paragraphFormat', 'align', 'formatOL', 'formatUL', '-', 'insertLink', 'insertHR', 'undo', 'redo'];
        $editor.froalaEditor({
            pastePlain: true,
            chooseLink: false,
            linkList: false,
            colorsHEXInput: false,
            quickInsertTags: [],
            toolbarButtons: toolbarButtons,
            toolbarButtonsXS: toolbarButtons,
            toolbarButtonsMD: toolbarButtons,
            toolbarButtonsSM: toolbarButtons,
            paragraphFormat: {
                N: 'Normal',
                H1: 'h1',
                H2: 'h2',
                H3: 'h3',
                H4: 'h4',
                H5: 'h5'
            }
        });
    });
}


////////////////////////////////////////////////////////////////////////////////

// 4. Generate A Preview Of The Data Object whilst editing

function generateJSON() {

    var codeOutput = document.getElementById('output');

    if (generatebtn) {
        generatebtn.onclick = function() {

            if($("#image-map").length) {
                $("#image-map").imageMapper("asHTML");
            }

            var firstItem = codeOutput.childNodes[0];
            var dataOutput = document.createTextNode(JSON.stringify(data, null, "\t"));

            if (firstItem == null) {
                codeOutput.appendChild(dataOutput);
            } else {
                codeOutput.replaceChild(dataOutput, firstItem);
            }

        };
    }
}

generateJSON();

function populateFroala() {
    if (data.data.froala) {
        $editor.find('p').replaceWith(data.data.froala);
    }
}

// populateFroala();

////////////////////////////////////////////////////////////////////////////////

// 5. Save the object back to ECMC

function saveBackToECMC() {
    if (saveBtn) {
        saveBtn.onclick = function() {
            // Quick test to ensure that the data we send back is changing. 
            data.number = data.number += 1;
            if (opener != null) {
                opener.updateFlexHtml(JSON.stringify(data));
                window.close();
            }
        };
    }
}

function toggleSideBar() {
    var sideBarCollapse = document.getElementById("menu-toggle");
    var sideBar = document.getElementById("wrapper");
    sideBarCollapse.addEventListener("click", function() {
        sideBar.classList.toggle("toggled");
    });
}


toggleSideBar();