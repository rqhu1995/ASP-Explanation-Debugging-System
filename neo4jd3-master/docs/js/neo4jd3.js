(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Neo4jd3 = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
'use strict';

var neo4jd3 = _dereq_('./scripts/neo4jd3');

module.exports = neo4jd3;

},{"./scripts/neo4jd3":2}],2:[function(_dereq_,module,exports){
/* global d3, document */
/* jshint latedef:nofunc */
'use strict';

function Neo4jD3(_selector, _options) {
    var container, graph, info, node, nodes, relationship, relationshipOutline, relationshipOverlay, relationshipText, relationships, selector, simulation, svg, svgNodes, svgRelationships, svgScale, svgTranslate,
        classes2colors = {},
        justLoaded = false,
        numClasses = 0,
        options = {
            arrowSize: 4,
            colors: colors(),
            highlight: undefined,
            iconMap: fontAwesomeIcons(),
            icons: undefined,
            imageMap: {},
            images: undefined,
            infoPanel: true,
            minCollision: undefined,
            neo4jData: undefined,
            neo4jDataUrl: undefined,
            tempDataUrl: undefined, //新加的没用
            nodeOutlineFillColor: undefined,
            nodeRadius: 25,
            relationshipColor: '#a5abb6',
            zoomFit: false
        },
        VERSION = '0.0.1';

    function appendGraph(container) {
        svg = container.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('class', 'neo4jd3-graph')
            .call(d3.zoom().on('zoom', function () {
                var scale = d3.event.transform.k,
                    translate = [d3.event.transform.x, d3.event.transform.y];

                if (svgTranslate) {
                    translate[0] += svgTranslate[0];
                    translate[1] += svgTranslate[1];
                }

                if (svgScale) {
                    scale *= svgScale;
                }

                svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
            }))
            .on('dblclick.zoom', null)
            .append('g')
            .attr('width', '100%')
            .attr('height', '100%');

        svgRelationships = svg.append('g')
            .attr('class', 'relationships');

        svgNodes = svg.append('g')
            .attr('class', 'nodes');
    }

    function appendImageToNode(node) {
        return node.append('image')
            .attr('height', function (d) {
                return icon(d) ? '24px' : '30px';
            })
            .attr('x', function (d) {
                return icon(d) ? '5px' : '-15px';
            })
            .attr('xlink:href', function (d) {
                return image(d);
            })
            .attr('y', function (d) {
                return icon(d) ? '5px' : '-16px';
            })
            .attr('width', function (d) {
                return icon(d) ? '24px' : '30px';
            });
    }

    function appendInfoPanel(container) {
        return container.append('div')
            .attr('class', 'neo4jd3-info');
    }

    function appendInfoElement(cls, isNode, property, value) {
        var elem = info.append('a');

        elem.attr('href', '#')
            .attr('class', cls)
            .html('<strong>' + property + '</strong>' + (value ? (': ' + value) : ''));

        if (!value) {
            elem.style('background-color', function (d) {
                return options.nodeOutlineFillColor ? options.nodeOutlineFillColor : (isNode ? class2color(property) : defaultColor());
            })
                .style('border-color', function (d) {
                    return options.nodeOutlineFillColor ? class2darkenColor(options.nodeOutlineFillColor) : (isNode ? class2darkenColor(property) : defaultDarkenColor());
                })
                .style('color', function (d) {
                    return options.nodeOutlineFillColor ? class2darkenColor(options.nodeOutlineFillColor) : '#fff';
                });
        }
    }

    function appendInfoElementClass(cls, node) {
        appendInfoElement(cls, true, node);
    }

    function appendInfoElementProperty(cls, property, value) {
        appendInfoElement(cls, false, property, value);
    }

    function appendInfoElementRelationship(cls, relationship) {
        appendInfoElement(cls, false, relationship);
    }

    function appendNode() {
        return node.enter()
            .append('g')
            .attr('class', function (d) {
                var highlight, i,
                    classes = 'node',
                    label = d.labels[0];

                if (icon(d)) {
                    classes += ' node-icon';
                }

                if (image(d)) {
                    classes += ' node-image';
                }

                if (options.highlight) {
                    for (i = 0; i < options.highlight.length; i++) {
                        highlight = options.highlight[i];

                        if (d.labels[0] === highlight.class && d.properties[highlight.property] === highlight.value) {
                            classes += ' node-highlighted';
                            break;
                        }
                    }
                }

                return classes;
            })
            .on('click', function (d) {
                d.fx = d.fy = null;

                if (typeof options.onNodeClick === 'function') {
                    options.onNodeClick(d);
                }
            })
            .on('dblclick', function (d) {
                stickNode(d);

                if (typeof options.onNodeDoubleClick === 'function') {
                    options.onNodeDoubleClick(d);
                }
            })
            .on('mouseenter', function (d) {
                if (info) {
                    updateInfo(d);
                }

                if (typeof options.onNodeMouseEnter === 'function') {
                    options.onNodeMouseEnter(d);
                }
            })
            .on('mouseleave', function (d) {
                if (info) {
                    clearInfo(d);
                }

                if (typeof options.onNodeMouseLeave === 'function') {
                    options.onNodeMouseLeave(d);
                }
            })
            .call(d3.drag()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded));
    }

    function appendNodeToGraph() {
        var n = appendNode();

        appendRingToNode(n);
        appendOutlineToNode(n);

        if (options.icons) {
            appendTextToNode(n);
        }

        if (options.images) {
            appendImageToNode(n);
        }

        return n;
    }

    function appendOutlineToNode(node) {
        return node.append('circle')
            .attr('class', 'outline')
            .attr('r', options.nodeRadius)
            .style('fill', function (d) {
                return options.nodeOutlineFillColor ? options.nodeOutlineFillColor : class2color(d.labels[0]);
            })
            .style('stroke', function (d) {
                return options.nodeOutlineFillColor ? class2darkenColor(options.nodeOutlineFillColor) : class2darkenColor(d.labels[0]);
            })
            .append('title').text(function (d) {
                return toString(d);
            });
    }

    function appendRingToNode(node) {
        return node.append('circle')
            .attr('class', 'ring')
            .attr('r', options.nodeRadius * 1.16)
            .append('title').text(function (d) {
                return toString(d);
            });
    }

    function appendTextToNode(node) {
        return node.append('text')
            .attr('class', function (d) {
                return 'text' + (icon(d) ? ' icon' : '');
            })
            .attr('fill', '#ffffff')
            .attr('font-size', function (d) {
                return icon(d) ? (options.nodeRadius + 'px') : '10px';
            })
            .attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .attr('y', function (d) {
                return icon(d) ? (parseInt(Math.round(options.nodeRadius * 0.32)) + 'px') : '4px';
            })
            .html(function (d) {
                var _icon = icon(d);
                return _icon ? '&#x' + _icon : d.id;
            });
    }

    function appendRandomDataToNode(d, maxNodesToGenerate) {
        var data = randomD3Data(d, maxNodesToGenerate);
        updateWithNeo4jData(data);
    }

    function appendRelationship() {
        return relationship.enter()
            .append('g')
            .attr('class', 'relationship')
            .on('dblclick', function (d) {
                if (typeof options.onRelationshipDoubleClick === 'function') {
                    options.onRelationshipDoubleClick(d);
                }
            })
            .on('mouseenter', function (d) {
                if (info) {
                    updateInfo(d);
                }
            });
    }

    function appendOutlineToRelationship(r) {
        return r.append('path')
            .attr('class', 'outline')
            .attr('fill', '#a5abb6')
            .attr('stroke', 'none');
    }

    function appendOverlayToRelationship(r) {
        return r.append('path')
            .attr('class', 'overlay');
    }

    function appendTextToRelationship(r) {
        return r.append('text')
            .attr('class', 'text')
            .attr('fill', '#000000')
            .attr('font-size', '8px')
            .attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .text(function (d) {
                return d.type;
            });
    }

    function appendRelationshipToGraph() {
        var relationship = appendRelationship(),
            text = appendTextToRelationship(relationship),
            outline = appendOutlineToRelationship(relationship),
            overlay = appendOverlayToRelationship(relationship);

        return {
            outline: outline,
            overlay: overlay,
            relationship: relationship,
            text: text
        };
    }

    function class2color(cls) {
        var color = classes2colors[cls];

        if (!color) {
            //            color = options.colors[Math.min(numClasses, options.colors.length - 1)];
            color = options.colors[numClasses % options.colors.length];
            classes2colors[cls] = color;
            numClasses++;
        }

        return color;
    }

    function class2darkenColor(cls) {
        return d3.rgb(class2color(cls)).darker(1);
    }

    function clearInfo() {
        info.html('');
    }

    function color() {
        return options.colors[options.colors.length * Math.random() << 0];
    }

    function colors() {
        // d3.schemeCategory10,
        // d3.schemeCategory20,
        return [
            '#68bdf6', // light blue
            '#6dce9e', // green #1
            '#faafc2', // light pink
            '#f2baf6', // purple
            '#ff928c', // light red
            '#fcea7e', // light yellow
            '#ffc766', // light orange
            '#405f9e', // navy blue
            '#a5abb6', // dark gray
            '#78cecb', // green #2,
            '#b88cbb', // dark purple
            '#ced2d9', // light gray
            '#e84646', // dark red
            '#fa5f86', // dark pink
            '#ffab1a', // dark orange
            '#fcda19', // dark yellow
            '#797b80', // black
            '#c9d96f', // pistacchio
            '#47991f', // green #3
            '#70edee', // turquoise
            '#ff75ea'  // pink
        ];
    }

    function contains(array, id) {
        var filter = array.filter(function (elem) {
            return elem.id === id;
        });

        return filter.length > 0;
    }

    function defaultColor() {
        return options.relationshipColor;
    }

    function defaultDarkenColor() {
        return d3.rgb(options.colors[options.colors.length - 1]).darker(1);
    }

    function dragEnded(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0);
        }

        if (typeof options.onNodeDragEnd === 'function') {
            options.onNodeDragEnd(d);
        }
    }

    function dragged(d) {
        stickNode(d);
    }

    function dragStarted(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }

        d.fx = d.x;
        d.fy = d.y;

        if (typeof options.onNodeDragStart === 'function') {
            options.onNodeDragStart(d);
        }
    }
    //改了但是没用
    function extend(d, maxNodesToGenerate) {
        var data = {
            nodes: [],
            relationships: []
        },
            i,
            label,
            node,
            numNodes = (maxNodesToGenerate * Math.random() << 0) + 1,
            relationship,
            s = size();

        for (i = 0; i < numNodes; i++) {
            label = randomLabel();

            node = {
                id: s.nodes + 1 + i,
                labels: [label],
                properties: {
                    random: label
                },
                x: d.x,
                y: d.y
            };

            data.nodes[data.nodes.length] = node;

            relationship = {
                id: s.relationships + 1 + i,
                type: label.toUpperCase(),
                startNode: d.id,
                endNode: s.nodes + 1 + i,
                properties: {
                    from: Date.now()
                },
                source: d.id,
                target: s.nodes + 1 + i,
                linknum: s.relationships + 1 + i
            };

            data.relationships[data.relationships.length] = relationship;
        }

        return data;



    }

    function fontAwesomeIcons() {
        return { 'glass': 'f000', 'music': 'f001', 'search': 'f002', 'envelope-o': 'f003', 'heart': 'f004', 'star': 'f005', 'star-o': 'f006', 'user': 'f007', 'film': 'f008', 'th-large': 'f009', 'th': 'f00a', 'th-list': 'f00b', 'check': 'f00c', 'remove,close,times': 'f00d', 'search-plus': 'f00e', 'search-minus': 'f010', 'power-off': 'f011', 'signal': 'f012', 'gear,cog': 'f013', 'trash-o': 'f014', 'home': 'f015', 'file-o': 'f016', 'clock-o': 'f017', 'road': 'f018', 'download': 'f019', 'arrow-circle-o-down': 'f01a', 'arrow-circle-o-up': 'f01b', 'inbox': 'f01c', 'play-circle-o': 'f01d', 'rotate-right,repeat': 'f01e', 'refresh': 'f021', 'list-alt': 'f022', 'lock': 'f023', 'flag': 'f024', 'headphones': 'f025', 'volume-off': 'f026', 'volume-down': 'f027', 'volume-up': 'f028', 'qrcode': 'f029', 'barcode': 'f02a', 'tag': 'f02b', 'tags': 'f02c', 'book': 'f02d', 'bookmark': 'f02e', 'print': 'f02f', 'camera': 'f030', 'font': 'f031', 'bold': 'f032', 'italic': 'f033', 'text-height': 'f034', 'text-width': 'f035', 'align-left': 'f036', 'align-center': 'f037', 'align-right': 'f038', 'align-justify': 'f039', 'list': 'f03a', 'dedent,outdent': 'f03b', 'indent': 'f03c', 'video-camera': 'f03d', 'photo,image,picture-o': 'f03e', 'pencil': 'f040', 'map-marker': 'f041', 'adjust': 'f042', 'tint': 'f043', 'edit,pencil-square-o': 'f044', 'share-square-o': 'f045', 'check-square-o': 'f046', 'arrows': 'f047', 'step-backward': 'f048', 'fast-backward': 'f049', 'backward': 'f04a', 'play': 'f04b', 'pause': 'f04c', 'stop': 'f04d', 'forward': 'f04e', 'fast-forward': 'f050', 'step-forward': 'f051', 'eject': 'f052', 'chevron-left': 'f053', 'chevron-right': 'f054', 'plus-circle': 'f055', 'minus-circle': 'f056', 'times-circle': 'f057', 'check-circle': 'f058', 'question-circle': 'f059', 'info-circle': 'f05a', 'crosshairs': 'f05b', 'times-circle-o': 'f05c', 'check-circle-o': 'f05d', 'ban': 'f05e', 'arrow-left': 'f060', 'arrow-right': 'f061', 'arrow-up': 'f062', 'arrow-down': 'f063', 'mail-forward,share': 'f064', 'expand': 'f065', 'compress': 'f066', 'plus': 'f067', 'minus': 'f068', 'asterisk': 'f069', 'exclamation-circle': 'f06a', 'gift': 'f06b', 'leaf': 'f06c', 'fire': 'f06d', 'eye': 'f06e', 'eye-slash': 'f070', 'warning,exclamation-triangle': 'f071', 'plane': 'f072', 'calendar': 'f073', 'random': 'f074', 'comment': 'f075', 'magnet': 'f076', 'chevron-up': 'f077', 'chevron-down': 'f078', 'retweet': 'f079', 'shopping-cart': 'f07a', 'folder': 'f07b', 'folder-open': 'f07c', 'arrows-v': 'f07d', 'arrows-h': 'f07e', 'bar-chart-o,bar-chart': 'f080', 'twitter-square': 'f081', 'facebook-square': 'f082', 'camera-retro': 'f083', 'key': 'f084', 'gears,cogs': 'f085', 'comments': 'f086', 'thumbs-o-up': 'f087', 'thumbs-o-down': 'f088', 'star-half': 'f089', 'heart-o': 'f08a', 'sign-out': 'f08b', 'linkedin-square': 'f08c', 'thumb-tack': 'f08d', 'external-link': 'f08e', 'sign-in': 'f090', 'trophy': 'f091', 'github-square': 'f092', 'upload': 'f093', 'lemon-o': 'f094', 'phone': 'f095', 'square-o': 'f096', 'bookmark-o': 'f097', 'phone-square': 'f098', 'twitter': 'f099', 'facebook-f,facebook': 'f09a', 'github': 'f09b', 'unlock': 'f09c', 'credit-card': 'f09d', 'feed,rss': 'f09e', 'hdd-o': 'f0a0', 'bullhorn': 'f0a1', 'bell': 'f0f3', 'certificate': 'f0a3', 'hand-o-right': 'f0a4', 'hand-o-left': 'f0a5', 'hand-o-up': 'f0a6', 'hand-o-down': 'f0a7', 'arrow-circle-left': 'f0a8', 'arrow-circle-right': 'f0a9', 'arrow-circle-up': 'f0aa', 'arrow-circle-down': 'f0ab', 'globe': 'f0ac', 'wrench': 'f0ad', 'tasks': 'f0ae', 'filter': 'f0b0', 'briefcase': 'f0b1', 'arrows-alt': 'f0b2', 'group,users': 'f0c0', 'chain,link': 'f0c1', 'cloud': 'f0c2', 'flask': 'f0c3', 'cut,scissors': 'f0c4', 'copy,files-o': 'f0c5', 'paperclip': 'f0c6', 'save,floppy-o': 'f0c7', 'square': 'f0c8', 'navicon,reorder,bars': 'f0c9', 'list-ul': 'f0ca', 'list-ol': 'f0cb', 'strikethrough': 'f0cc', 'underline': 'f0cd', 'table': 'f0ce', 'magic': 'f0d0', 'truck': 'f0d1', 'pinterest': 'f0d2', 'pinterest-square': 'f0d3', 'google-plus-square': 'f0d4', 'google-plus': 'f0d5', 'money': 'f0d6', 'caret-down': 'f0d7', 'caret-up': 'f0d8', 'caret-left': 'f0d9', 'caret-right': 'f0da', 'columns': 'f0db', 'unsorted,sort': 'f0dc', 'sort-down,sort-desc': 'f0dd', 'sort-up,sort-asc': 'f0de', 'envelope': 'f0e0', 'linkedin': 'f0e1', 'rotate-left,undo': 'f0e2', 'legal,gavel': 'f0e3', 'dashboard,tachometer': 'f0e4', 'comment-o': 'f0e5', 'comments-o': 'f0e6', 'flash,bolt': 'f0e7', 'sitemap': 'f0e8', 'umbrella': 'f0e9', 'paste,clipboard': 'f0ea', 'lightbulb-o': 'f0eb', 'exchange': 'f0ec', 'cloud-download': 'f0ed', 'cloud-upload': 'f0ee', 'user-md': 'f0f0', 'stethoscope': 'f0f1', 'suitcase': 'f0f2', 'bell-o': 'f0a2', 'coffee': 'f0f4', 'cutlery': 'f0f5', 'file-text-o': 'f0f6', 'building-o': 'f0f7', 'hospital-o': 'f0f8', 'ambulance': 'f0f9', 'medkit': 'f0fa', 'fighter-jet': 'f0fb', 'beer': 'f0fc', 'h-square': 'f0fd', 'plus-square': 'f0fe', 'angle-double-left': 'f100', 'angle-double-right': 'f101', 'angle-double-up': 'f102', 'angle-double-down': 'f103', 'angle-left': 'f104', 'angle-right': 'f105', 'angle-up': 'f106', 'angle-down': 'f107', 'desktop': 'f108', 'laptop': 'f109', 'tablet': 'f10a', 'mobile-phone,mobile': 'f10b', 'circle-o': 'f10c', 'quote-left': 'f10d', 'quote-right': 'f10e', 'spinner': 'f110', 'circle': 'f111', 'mail-reply,reply': 'f112', 'github-alt': 'f113', 'folder-o': 'f114', 'folder-open-o': 'f115', 'smile-o': 'f118', 'frown-o': 'f119', 'meh-o': 'f11a', 'gamepad': 'f11b', 'keyboard-o': 'f11c', 'flag-o': 'f11d', 'flag-checkered': 'f11e', 'terminal': 'f120', 'code': 'f121', 'mail-reply-all,reply-all': 'f122', 'star-half-empty,star-half-full,star-half-o': 'f123', 'location-arrow': 'f124', 'crop': 'f125', 'code-fork': 'f126', 'unlink,chain-broken': 'f127', 'question': 'f128', 'info': 'f129', 'exclamation': 'f12a', 'superscript': 'f12b', 'subscript': 'f12c', 'eraser': 'f12d', 'puzzle-piece': 'f12e', 'microphone': 'f130', 'microphone-slash': 'f131', 'shield': 'f132', 'calendar-o': 'f133', 'fire-extinguisher': 'f134', 'rocket': 'f135', 'maxcdn': 'f136', 'chevron-circle-left': 'f137', 'chevron-circle-right': 'f138', 'chevron-circle-up': 'f139', 'chevron-circle-down': 'f13a', 'html5': 'f13b', 'css3': 'f13c', 'anchor': 'f13d', 'unlock-alt': 'f13e', 'bullseye': 'f140', 'ellipsis-h': 'f141', 'ellipsis-v': 'f142', 'rss-square': 'f143', 'play-circle': 'f144', 'ticket': 'f145', 'minus-square': 'f146', 'minus-square-o': 'f147', 'level-up': 'f148', 'level-down': 'f149', 'check-square': 'f14a', 'pencil-square': 'f14b', 'external-link-square': 'f14c', 'share-square': 'f14d', 'compass': 'f14e', 'toggle-down,caret-square-o-down': 'f150', 'toggle-up,caret-square-o-up': 'f151', 'toggle-right,caret-square-o-right': 'f152', 'euro,eur': 'f153', 'gbp': 'f154', 'dollar,usd': 'f155', 'rupee,inr': 'f156', 'cny,rmb,yen,jpy': 'f157', 'ruble,rouble,rub': 'f158', 'won,krw': 'f159', 'bitcoin,btc': 'f15a', 'file': 'f15b', 'file-text': 'f15c', 'sort-alpha-asc': 'f15d', 'sort-alpha-desc': 'f15e', 'sort-amount-asc': 'f160', 'sort-amount-desc': 'f161', 'sort-numeric-asc': 'f162', 'sort-numeric-desc': 'f163', 'thumbs-up': 'f164', 'thumbs-down': 'f165', 'youtube-square': 'f166', 'youtube': 'f167', 'xing': 'f168', 'xing-square': 'f169', 'youtube-play': 'f16a', 'dropbox': 'f16b', 'stack-overflow': 'f16c', 'instagram': 'f16d', 'flickr': 'f16e', 'adn': 'f170', 'bitbucket': 'f171', 'bitbucket-square': 'f172', 'tumblr': 'f173', 'tumblr-square': 'f174', 'long-arrow-down': 'f175', 'long-arrow-up': 'f176', 'long-arrow-left': 'f177', 'long-arrow-right': 'f178', 'apple': 'f179', 'windows': 'f17a', 'android': 'f17b', 'linux': 'f17c', 'dribbble': 'f17d', 'skype': 'f17e', 'foursquare': 'f180', 'trello': 'f181', 'female': 'f182', 'male': 'f183', 'gittip,gratipay': 'f184', 'sun-o': 'f185', 'moon-o': 'f186', 'archive': 'f187', 'bug': 'f188', 'vk': 'f189', 'weibo': 'f18a', 'renren': 'f18b', 'pagelines': 'f18c', 'stack-exchange': 'f18d', 'arrow-circle-o-right': 'f18e', 'arrow-circle-o-left': 'f190', 'toggle-left,caret-square-o-left': 'f191', 'dot-circle-o': 'f192', 'wheelchair': 'f193', 'vimeo-square': 'f194', 'turkish-lira,try': 'f195', 'plus-square-o': 'f196', 'space-shuttle': 'f197', 'slack': 'f198', 'envelope-square': 'f199', 'wordpress': 'f19a', 'openid': 'f19b', 'institution,bank,university': 'f19c', 'mortar-board,graduation-cap': 'f19d', 'yahoo': 'f19e', 'google': 'f1a0', 'reddit': 'f1a1', 'reddit-square': 'f1a2', 'stumbleupon-circle': 'f1a3', 'stumbleupon': 'f1a4', 'delicious': 'f1a5', 'digg': 'f1a6', 'pied-piper-pp': 'f1a7', 'pied-piper-alt': 'f1a8', 'drupal': 'f1a9', 'joomla': 'f1aa', 'language': 'f1ab', 'fax': 'f1ac', 'building': 'f1ad', 'child': 'f1ae', 'paw': 'f1b0', 'spoon': 'f1b1', 'cube': 'f1b2', 'cubes': 'f1b3', 'behance': 'f1b4', 'behance-square': 'f1b5', 'steam': 'f1b6', 'steam-square': 'f1b7', 'recycle': 'f1b8', 'automobile,car': 'f1b9', 'cab,taxi': 'f1ba', 'tree': 'f1bb', 'spotify': 'f1bc', 'deviantart': 'f1bd', 'soundcloud': 'f1be', 'database': 'f1c0', 'file-pdf-o': 'f1c1', 'file-word-o': 'f1c2', 'file-excel-o': 'f1c3', 'file-powerpoint-o': 'f1c4', 'file-photo-o,file-picture-o,file-image-o': 'f1c5', 'file-zip-o,file-archive-o': 'f1c6', 'file-sound-o,file-audio-o': 'f1c7', 'file-movie-o,file-video-o': 'f1c8', 'file-code-o': 'f1c9', 'vine': 'f1ca', 'codepen': 'f1cb', 'jsfiddle': 'f1cc', 'life-bouy,life-buoy,life-saver,support,life-ring': 'f1cd', 'circle-o-notch': 'f1ce', 'ra,resistance,rebel': 'f1d0', 'ge,empire': 'f1d1', 'git-square': 'f1d2', 'git': 'f1d3', 'y-combinator-square,yc-square,hacker-news': 'f1d4', 'tencent-weibo': 'f1d5', 'qq': 'f1d6', 'wechat,weixin': 'f1d7', 'send,paper-plane': 'f1d8', 'send-o,paper-plane-o': 'f1d9', 'history': 'f1da', 'circle-thin': 'f1db', 'header': 'f1dc', 'paragraph': 'f1dd', 'sliders': 'f1de', 'share-alt': 'f1e0', 'share-alt-square': 'f1e1', 'bomb': 'f1e2', 'soccer-ball-o,futbol-o': 'f1e3', 'tty': 'f1e4', 'binoculars': 'f1e5', 'plug': 'f1e6', 'slideshare': 'f1e7', 'twitch': 'f1e8', 'yelp': 'f1e9', 'newspaper-o': 'f1ea', 'wifi': 'f1eb', 'calculator': 'f1ec', 'paypal': 'f1ed', 'google-wallet': 'f1ee', 'cc-visa': 'f1f0', 'cc-mastercard': 'f1f1', 'cc-discover': 'f1f2', 'cc-amex': 'f1f3', 'cc-paypal': 'f1f4', 'cc-stripe': 'f1f5', 'bell-slash': 'f1f6', 'bell-slash-o': 'f1f7', 'trash': 'f1f8', 'copyright': 'f1f9', 'at': 'f1fa', 'eyedropper': 'f1fb', 'paint-brush': 'f1fc', 'birthday-cake': 'f1fd', 'area-chart': 'f1fe', 'pie-chart': 'f200', 'line-chart': 'f201', 'lastfm': 'f202', 'lastfm-square': 'f203', 'toggle-off': 'f204', 'toggle-on': 'f205', 'bicycle': 'f206', 'bus': 'f207', 'ioxhost': 'f208', 'angellist': 'f209', 'cc': 'f20a', 'shekel,sheqel,ils': 'f20b', 'meanpath': 'f20c', 'buysellads': 'f20d', 'connectdevelop': 'f20e', 'dashcube': 'f210', 'forumbee': 'f211', 'leanpub': 'f212', 'sellsy': 'f213', 'shirtsinbulk': 'f214', 'simplybuilt': 'f215', 'skyatlas': 'f216', 'cart-plus': 'f217', 'cart-arrow-down': 'f218', 'diamond': 'f219', 'ship': 'f21a', 'user-secret': 'f21b', 'motorcycle': 'f21c', 'street-view': 'f21d', 'heartbeat': 'f21e', 'venus': 'f221', 'mars': 'f222', 'mercury': 'f223', 'intersex,transgender': 'f224', 'transgender-alt': 'f225', 'venus-double': 'f226', 'mars-double': 'f227', 'venus-mars': 'f228', 'mars-stroke': 'f229', 'mars-stroke-v': 'f22a', 'mars-stroke-h': 'f22b', 'neuter': 'f22c', 'genderless': 'f22d', 'facebook-official': 'f230', 'pinterest-p': 'f231', 'whatsapp': 'f232', 'server': 'f233', 'user-plus': 'f234', 'user-times': 'f235', 'hotel,bed': 'f236', 'viacoin': 'f237', 'train': 'f238', 'subway': 'f239', 'medium': 'f23a', 'yc,y-combinator': 'f23b', 'optin-monster': 'f23c', 'opencart': 'f23d', 'expeditedssl': 'f23e', 'battery-4,battery-full': 'f240', 'battery-3,battery-three-quarters': 'f241', 'battery-2,battery-half': 'f242', 'battery-1,battery-quarter': 'f243', 'battery-0,battery-empty': 'f244', 'mouse-pointer': 'f245', 'i-cursor': 'f246', 'object-group': 'f247', 'object-ungroup': 'f248', 'sticky-note': 'f249', 'sticky-note-o': 'f24a', 'cc-jcb': 'f24b', 'cc-diners-club': 'f24c', 'clone': 'f24d', 'balance-scale': 'f24e', 'hourglass-o': 'f250', 'hourglass-1,hourglass-start': 'f251', 'hourglass-2,hourglass-half': 'f252', 'hourglass-3,hourglass-end': 'f253', 'hourglass': 'f254', 'hand-grab-o,hand-rock-o': 'f255', 'hand-stop-o,hand-paper-o': 'f256', 'hand-scissors-o': 'f257', 'hand-lizard-o': 'f258', 'hand-spock-o': 'f259', 'hand-pointer-o': 'f25a', 'hand-peace-o': 'f25b', 'trademark': 'f25c', 'registered': 'f25d', 'creative-commons': 'f25e', 'gg': 'f260', 'gg-circle': 'f261', 'tripadvisor': 'f262', 'odnoklassniki': 'f263', 'odnoklassniki-square': 'f264', 'get-pocket': 'f265', 'wikipedia-w': 'f266', 'safari': 'f267', 'chrome': 'f268', 'firefox': 'f269', 'opera': 'f26a', 'internet-explorer': 'f26b', 'tv,television': 'f26c', 'contao': 'f26d', '500px': 'f26e', 'amazon': 'f270', 'calendar-plus-o': 'f271', 'calendar-minus-o': 'f272', 'calendar-times-o': 'f273', 'calendar-check-o': 'f274', 'industry': 'f275', 'map-pin': 'f276', 'map-signs': 'f277', 'map-o': 'f278', 'map': 'f279', 'commenting': 'f27a', 'commenting-o': 'f27b', 'houzz': 'f27c', 'vimeo': 'f27d', 'black-tie': 'f27e', 'fonticons': 'f280', 'reddit-alien': 'f281', 'edge': 'f282', 'credit-card-alt': 'f283', 'codiepie': 'f284', 'modx': 'f285', 'fort-awesome': 'f286', 'usb': 'f287', 'product-hunt': 'f288', 'mixcloud': 'f289', 'scribd': 'f28a', 'pause-circle': 'f28b', 'pause-circle-o': 'f28c', 'stop-circle': 'f28d', 'stop-circle-o': 'f28e', 'shopping-bag': 'f290', 'shopping-basket': 'f291', 'hashtag': 'f292', 'bluetooth': 'f293', 'bluetooth-b': 'f294', 'percent': 'f295', 'gitlab': 'f296', 'wpbeginner': 'f297', 'wpforms': 'f298', 'envira': 'f299', 'universal-access': 'f29a', 'wheelchair-alt': 'f29b', 'question-circle-o': 'f29c', 'blind': 'f29d', 'audio-description': 'f29e', 'volume-control-phone': 'f2a0', 'braille': 'f2a1', 'assistive-listening-systems': 'f2a2', 'asl-interpreting,american-sign-language-interpreting': 'f2a3', 'deafness,hard-of-hearing,deaf': 'f2a4', 'glide': 'f2a5', 'glide-g': 'f2a6', 'signing,sign-language': 'f2a7', 'low-vision': 'f2a8', 'viadeo': 'f2a9', 'viadeo-square': 'f2aa', 'snapchat': 'f2ab', 'snapchat-ghost': 'f2ac', 'snapchat-square': 'f2ad', 'pied-piper': 'f2ae', 'first-order': 'f2b0', 'yoast': 'f2b1', 'themeisle': 'f2b2', 'google-plus-circle,google-plus-official': 'f2b3', 'fa,font-awesome': 'f2b4' };
    }

    function icon(d) {
        var code;

        if (options.iconMap && options.showIcons && options.icons) {
            if (options.icons[d.labels[0]] && options.iconMap[options.icons[d.labels[0]]]) {
                code = options.iconMap[options.icons[d.labels[0]]];
            } else if (options.iconMap[d.labels[0]]) {
                code = options.iconMap[d.labels[0]];
            } else if (options.icons[d.labels[0]]) {
                code = options.icons[d.labels[0]];
            }
        }

        return code;
    }

    function image(d) {
        var i, imagesForLabel, img, imgLevel, label, labelPropertyValue, property, value;

        if (options.images) {
            imagesForLabel = options.imageMap[d.labels[0]];

            if (imagesForLabel) {
                imgLevel = 0;

                for (i = 0; i < imagesForLabel.length; i++) {
                    labelPropertyValue = imagesForLabel[i].split('|');

                    switch (labelPropertyValue.length) {
                        case 3:
                            value = labelPropertyValue[2];
                        /* falls through */
                        case 2:
                            property = labelPropertyValue[1];
                        /* falls through */
                        case 1:
                            label = labelPropertyValue[0];
                    }

                    if (d.labels[0] === label &&
                        (!property || d.properties[property] !== undefined) &&
                        (!value || d.properties[property] === value)) {
                        if (labelPropertyValue.length > imgLevel) {
                            img = options.images[imagesForLabel[i]];
                            imgLevel = labelPropertyValue.length;
                        }
                    }
                }
            }
        }

        return img;
    }

    function init(_selector, _options) {
        initIconMap();

        merge(options, _options);

        if (options.icons) {
            options.showIcons = true;
        }

        if (!options.minCollision) {
            options.minCollision = options.nodeRadius * 2;
        }

        initImageMap();

        selector = _selector;

        container = d3.select(selector);

        container.attr('class', 'neo4jd3')
            .html('');

        if (options.infoPanel) {
            info = appendInfoPanel(container);
        }

        appendGraph(container);

        simulation = initSimulation();

        if (options.neo4jData) {
            loadNeo4jData(options.neo4jData);
        } else if (options.neo4jDataUrl) {
            loadNeo4jDataFromUrl(options.neo4jDataUrl);
            // loadNeo4jDataFromUrl('json/temp.json');
        } else {
            console.error('Error: both neo4jData and neo4jDataUrl are empty!');
        }
    }


    function initIconMap() {
        Object.keys(options.iconMap).forEach(function (key, index) {
            var keys = key.split(','),
                value = options.iconMap[key];

            keys.forEach(function (key) {
                options.iconMap[key] = value;
            });
        });
    }

    function initImageMap() {
        var key, keys, selector;

        for (key in options.images) {
            if (options.images.hasOwnProperty(key)) {
                keys = key.split('|');

                if (!options.imageMap[keys[0]]) {
                    options.imageMap[keys[0]] = [key];
                } else {
                    options.imageMap[keys[0]].push(key);
                }
            }
        }
    }

    function initSimulation() {
        var simulation = d3.forceSimulation()
            //                           .velocityDecay(0.8)
            //                           .force('x', d3.force().strength(0.002))
            //                           .force('y', d3.force().strength(0.002))
            .force('collide', d3.forceCollide().radius(function (d) {
                return options.minCollision;
            }).iterations(2))
            .force('charge', d3.forceManyBody())
            .force('link', d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force('center', d3.forceCenter(svg.node().parentElement.parentElement.clientWidth / 2, svg.node().parentElement.parentElement.clientHeight / 2))
            .on('tick', function () {
                tick();
            })
            .on('end', function () {
                if (options.zoomFit && !justLoaded) {
                    justLoaded = true;
                    zoomFit(2);
                }
            });

        return simulation;
    }

    function loadNeo4jData() {
        nodes = [];
        relationships = [];

        updateWithNeo4jData(options.neo4jData);
    }

    function loadNeo4jDataFromUrl(neo4jDataUrl) {
        nodes = [];
        relationships = [];

        d3.json(neo4jDataUrl, function (error, data) {
            if (error) {
                throw error;
            }

            updateWithNeo4jData(data);
        });
    }

    function merge(target, source) {
        Object.keys(source).forEach(function (property) {
            target[property] = source[property];
        });
    }

    function neo4jDataToD3Data(data) {
        var graph = {
            nodes: [],
            relationships: []
        };

        data.results.forEach(function (result) {
            result.data.forEach(function (data) {
                data.graph.nodes.forEach(function (node) {
                    if (!contains(graph.nodes, node.id)) {
                        graph.nodes.push(node);
                    }
                });

                data.graph.relationships.forEach(function (relationship) {
                    relationship.source = relationship.startNode;
                    relationship.target = relationship.endNode;
                    graph.relationships.push(relationship);
                });

                data.graph.relationships.sort(function (a, b) {
                    if (a.source > b.source) {
                        return 1;
                    } else if (a.source < b.source) {
                        return -1;
                    } else {
                        if (a.target > b.target) {
                            return 1;
                        }

                        if (a.target < b.target) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                });

                for (var i = 0; i < data.graph.relationships.length; i++) {
                    if (i !== 0 && data.graph.relationships[i].source === data.graph.relationships[i - 1].source && data.graph.relationships[i].target === data.graph.relationships[i - 1].target) {
                        data.graph.relationships[i].linknum = data.graph.relationships[i - 1].linknum + 1;
                    } else {
                        data.graph.relationships[i].linknum = 1;
                    }
                }
            });
        });

        return graph;
    }
    var mp = new Array();
    var rel = new Array();
    function randomD3Data(d, maxNodesToGenerate) {
        var data = {
            nodes: [],
            relationships: []
        },
            i,
            j,
            label,
            node,
            next_node_rel,
            next_node_dict,
            next_node,
            next_rel,
            numNodes = (maxNodesToGenerate * Math.random() << 0) + 1,
            relationship,
            s = size();

        for (i = 0; i < numNodes; i++) {
            label = randomLabel();
            next_node_dict = findTheNextNode(d,maxNodesToGenerate);
            for(j = 0; j < next_node_dict.rel.length ; j++){
                
              //  next_node_rel = next_node_dict.node[j];
                next_node = next_node_dict.node[j];
                next_rel = next_node_dict.rel[j];
                node = {
                    id: next_node["id"],
                    labels: next_node["labels"],
                    properties: next_node["properties"],
                    x: d.x,
                    y: d.y
                };
                //alert(next_node.properties.used);
                if(next_node.properties.used !== 'true'){
                    data.nodes[data.nodes.length] = node;
                }
                
    
                relationship = {
                    id: next_rel["id"],
                    type: next_rel["type"].toUpperCase(),
                    startNode: d.id,
                    endNode: next_node["id"],
                    properties: next_rel["properties"],
                    source: d.id,
                    target: next_node["id"],
                    linknum: s.relationships + 1 + i
                };
                if(next_rel.properties.used !== 'true'){
                    data.relationships[data.relationships.length] = relationship;
                }
                
            }
            
            
        }

        return data;
    }

    function findTheNextNode(d, maxNodesToGenerate) {
        var data = {
            nodes: [
                {
                    "id": "1",
                    "labels": ["User"],
                    "properties": {
                        "userId": "eisman",
                        "used": "true"
                    }
                },
                {
                    "id": "8",
                    "labels": ["Project"],
                    "properties": {
                        "name": "neo4jd3",
                        "title": "neo4jd3.js",
                        "description": "Neo4j graph visualization using D3.js.",
                        "url": "https://eisman.github.io/neo4jd3",
                        "used": "false"
                    }
                },
                {
                    "id": "9",
                    "labels": ["Usefffr"],
                    "properties": {
                        "userId": "eisman",
                        "used": "false"
                    }
                },
                {
                    "id": "2",
                    "labels": ["User"],
                    "properties": {
                        "userId": "eisman",
                        "used": "true"
                    }
                },
                {
                    "id": "P",
                    "labels": ["Useffr"],
                    "properties": {
                        "userId": "eisman",
                        "used": "false"
                    }
                },
                {
                    "id": "Q",
                    "labels": ["Useffr"],
                    "properties": {
                        "userId": "eisman",
                        "used": "false"
                    }
                }
            ],
            relationships: [
                {
                    "id": "7",
                    "type": "DEVELOPES",
                    "startNode": "1",
                    "endNode": "8",
                    "properties": {
                        "from": 1470002400000,
                        "used": 'false'
                    },
                    "source": "1",
                    "target": "8",
                    "linknum": 1
                },
                {
                    "id": "8",
                    "type": "DEVELOPES",
                    "startNode": "8",
                    "endNode": "9",
                    "properties": {
                        "from": 1470002400000,
                        "used": 'false'
                    },
                    "source": "8",
                    "target": "9",
                    "linknum": 2
                },
                {
                    "id": "9",
                    "type": "DEVELOPES",
                    "startNode": "1",
                    "endNode": "P",
                    "properties": {
                        "from": 1470002400000,
                        "used": 'false'
                    },
                    "source": "1",
                    "target": "P",
                    "linknum": 3
                },
                {
                    "id": "10",
                    "type": "DEVELOPES",
                    "startNode": "2",
                    "endNode": "8",
                    "properties": {
                        "from": 1470002400000,
                        "used": 'false'
                    },
                    "source": "2",
                    "target": "8",
                    "linknum": 1
                },
                {
                    "id": "11",
                    "type": "DEVELOPES",
                    "startNode": "1",
                    "endNode": "Q",
                    "properties": {
                        "from": 1470002400000,
                        "used": 'false'
                    },
                    "source": "1",
                    "target": "Q",
                    "linknum": 1
                }
            ]
        },i,j,k = 0,
        dictnextnode ={
            node:[],
            rel:[]
        };
        for (i = 0; i < data.relationships.length; i++) {
            if (data.relationships[i].startNode === d.id) {
               // alert(i);
                for (j = 0; j < data.nodes.length; j++) {
                    if (data.nodes[j].id === data.relationships[i].endNode) {
                        
                        if(mp[data.nodes[j].id] === 1){
                           // alert(data.nodes[j].id);
                            data.nodes[j].properties.used = 'true';
                        }
                        else{
                            k++;
                            mp[data.nodes[j].id] = 1;
                        }
                        if(rel[data.relationships[i].id] === 1){
                            // alert(data.nodes[j].id);
                             data.relationships[i].properties.used = 'true';
                         }
                         else{
                             rel[data.relationships[i].id] = 1;
                         }
                        dictnextnode.node[dictnextnode.node.length] = data.nodes[j];
                        dictnextnode.rel[dictnextnode.rel.length] = data.relationships[i];
                        if (k === maxNodesToGenerate) {break;}
                        //alert(data.nodes[j].properties.used);
                        //    data.nodes[j].properties.used = 'true';
                          //  alert(data.nodes[j].properties.used);
                            
                            //console.log(dictnextnode);
                            //return {node:data.nodes[j], rel:data.relationships[i]};
                        
                        
                    }
                }
            }
            if (k === maxNodesToGenerate) {break;}
        }
        console.log(dictnextnode);
        return dictnextnode;

        
    }

    function randomLabel() {
        var icons = Object.keys(options.iconMap);
        return icons[icons.length * Math.random() << 0];
    }

    function rotate(cx, cy, x, y, angle) {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

        return { x: nx, y: ny };
    }

    function rotatePoint(c, p, angle) {
        return rotate(c.x, c.y, p.x, p.y, angle);
    }

    function rotation(source, target) {
        return Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
    }

    function size() {
        return {
            nodes: nodes.length,
            relationships: relationships.length
        };
    }
    /*
        function smoothTransform(elem, translate, scale) {
            var animationMilliseconds = 5000,
                timeoutMilliseconds = 50,
                steps = parseInt(animationMilliseconds / timeoutMilliseconds);
    
            setTimeout(function() {
                smoothTransformStep(elem, translate, scale, timeoutMilliseconds, 1, steps);
            }, timeoutMilliseconds);
        }
    
        function smoothTransformStep(elem, translate, scale, timeoutMilliseconds, step, steps) {
            var progress = step / steps;
    
            elem.attr('transform', 'translate(' + (translate[0] * progress) + ', ' + (translate[1] * progress) + ') scale(' + (scale * progress) + ')');
    
            if (step < steps) {
                setTimeout(function() {
                    smoothTransformStep(elem, translate, scale, timeoutMilliseconds, step + 1, steps);
                }, timeoutMilliseconds);
            }
        }
    */
    function stickNode(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function tick() {
        tickNodes();
        tickRelationships();
    }

    function tickNodes() {
        if (node) {
            node.attr('transform', function (d) {
                return 'translate(' + d.x + ', ' + d.y + ')';
            });
        }
    }

    function tickRelationships() {
        if (relationship) {
            relationship.attr('transform', function (d) {
                var angle = rotation(d.source, d.target);
                return 'translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')';
            });

            tickRelationshipsTexts();
            tickRelationshipsOutlines();
            tickRelationshipsOverlays();
        }
    }

    function tickRelationshipsOutlines() {
        relationship.each(function (relationship) {
            var rel = d3.select(this),
                outline = rel.select('.outline'),
                text = rel.select('.text'),
                bbox = text.node().getBBox(),
                padding = 3;

            outline.attr('d', function (d) {
                var center = { x: 0, y: 0 },
                    angle = rotation(d.source, d.target),
                    textBoundingBox = text.node().getBBox(),
                    textPadding = 5,
                    u = unitaryVector(d.source, d.target),
                    textMargin = { x: (d.target.x - d.source.x - (textBoundingBox.width + textPadding) * u.x) * 0.5, y: (d.target.y - d.source.y - (textBoundingBox.width + textPadding) * u.y) * 0.5 },
                    n = unitaryNormalVector(d.source, d.target),
                    rotatedPointA1 = rotatePoint(center, { x: 0 + (options.nodeRadius + 1) * u.x - n.x, y: 0 + (options.nodeRadius + 1) * u.y - n.y }, angle),
                    rotatedPointB1 = rotatePoint(center, { x: textMargin.x - n.x, y: textMargin.y - n.y }, angle),
                    rotatedPointC1 = rotatePoint(center, { x: textMargin.x, y: textMargin.y }, angle),
                    rotatedPointD1 = rotatePoint(center, { x: 0 + (options.nodeRadius + 1) * u.x, y: 0 + (options.nodeRadius + 1) * u.y }, angle),
                    rotatedPointA2 = rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x - n.x, y: d.target.y - d.source.y - textMargin.y - n.y }, angle),
                    rotatedPointB2 = rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - n.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - n.y - u.y * options.arrowSize }, angle),
                    rotatedPointC2 = rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - n.x + (n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - n.y + (n.y - u.y) * options.arrowSize }, angle),
                    rotatedPointD2 = rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y }, angle),
                    rotatedPointE2 = rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x + (- n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y + (- n.y - u.y) * options.arrowSize }, angle),
                    rotatedPointF2 = rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - u.y * options.arrowSize }, angle),
                    rotatedPointG2 = rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x, y: d.target.y - d.source.y - textMargin.y }, angle);

                return 'M ' + rotatedPointA1.x + ' ' + rotatedPointA1.y +
                    ' L ' + rotatedPointB1.x + ' ' + rotatedPointB1.y +
                    ' L ' + rotatedPointC1.x + ' ' + rotatedPointC1.y +
                    ' L ' + rotatedPointD1.x + ' ' + rotatedPointD1.y +
                    ' Z M ' + rotatedPointA2.x + ' ' + rotatedPointA2.y +
                    ' L ' + rotatedPointB2.x + ' ' + rotatedPointB2.y +
                    ' L ' + rotatedPointC2.x + ' ' + rotatedPointC2.y +
                    ' L ' + rotatedPointD2.x + ' ' + rotatedPointD2.y +
                    ' L ' + rotatedPointE2.x + ' ' + rotatedPointE2.y +
                    ' L ' + rotatedPointF2.x + ' ' + rotatedPointF2.y +
                    ' L ' + rotatedPointG2.x + ' ' + rotatedPointG2.y +
                    ' Z';
            });
        });
    }

    function tickRelationshipsOverlays() {
        relationshipOverlay.attr('d', function (d) {
            var center = { x: 0, y: 0 },
                angle = rotation(d.source, d.target),
                n1 = unitaryNormalVector(d.source, d.target),
                n = unitaryNormalVector(d.source, d.target, 50),
                rotatedPointA = rotatePoint(center, { x: 0 - n.x, y: 0 - n.y }, angle),
                rotatedPointB = rotatePoint(center, { x: d.target.x - d.source.x - n.x, y: d.target.y - d.source.y - n.y }, angle),
                rotatedPointC = rotatePoint(center, { x: d.target.x - d.source.x + n.x - n1.x, y: d.target.y - d.source.y + n.y - n1.y }, angle),
                rotatedPointD = rotatePoint(center, { x: 0 + n.x - n1.x, y: 0 + n.y - n1.y }, angle);

            return 'M ' + rotatedPointA.x + ' ' + rotatedPointA.y +
                ' L ' + rotatedPointB.x + ' ' + rotatedPointB.y +
                ' L ' + rotatedPointC.x + ' ' + rotatedPointC.y +
                ' L ' + rotatedPointD.x + ' ' + rotatedPointD.y +
                ' Z';
        });
    }

    function tickRelationshipsTexts() {
        relationshipText.attr('transform', function (d) {
            var angle = (rotation(d.source, d.target) + 360) % 360,
                mirror = angle > 90 && angle < 270,
                center = { x: 0, y: 0 },
                n = unitaryNormalVector(d.source, d.target),
                nWeight = mirror ? 2 : -3,
                point = { x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight, y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight },
                rotatedPoint = rotatePoint(center, point, angle);

            return 'translate(' + rotatedPoint.x + ', ' + rotatedPoint.y + ') rotate(' + (mirror ? 180 : 0) + ')';
        });
    }

    function toString(d) {
        var s = d.labels ? d.labels[0] : d.type;

        s += ' (<id>: ' + d.id;

        Object.keys(d.properties).forEach(function (property) {
            s += ', ' + property + ': ' + JSON.stringify(d.properties[property]);
        });

        s += ')';

        return s;
    }

    function unitaryNormalVector(source, target, newLength) {
        var center = { x: 0, y: 0 },
            vector = unitaryVector(source, target, newLength);

        return rotatePoint(center, vector, 90);
    }

    function unitaryVector(source, target, newLength) {
        var length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)) / Math.sqrt(newLength || 1);

        return {
            x: (target.x - source.x) / length,
            y: (target.y - source.y) / length,
        };
    }

    function updateWithD3Data(d3Data) {

        updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
    }

    function updateWithNeo4jData(neo4jData) {
        var d3Data = neo4jDataToD3Data(neo4jData);
        updateWithD3Data(d3Data);
    }

    function updateInfo(d) {
        clearInfo();

        if (d.labels) {
            appendInfoElementClass('class', d.labels[0]);
        } else {
            appendInfoElementRelationship('class', d.type);
        }

        appendInfoElementProperty('property', '&lt;id&gt;', d.id);

        Object.keys(d.properties).forEach(function (property) {
            appendInfoElementProperty('property', property, JSON.stringify(d.properties[property]));
        });
    }

    function updateNodes(n) {
        Array.prototype.push.apply(nodes, n);

        node = svgNodes.selectAll('.node')
            .data(nodes, function (d) { return d.id; });
        var nodeEnter = appendNodeToGraph();
        node = nodeEnter.merge(node);
    }

    function updateNodesAndRelationships(n, r) {
        updateRelationships(r);
        updateNodes(n);

        simulation.nodes(nodes);
        simulation.force('link').links(relationships);
    }

    function updateRelationships(r) {
        Array.prototype.push.apply(relationships, r);

        relationship = svgRelationships.selectAll('.relationship')
            .data(relationships, function (d) { return d.id; });

        var relationshipEnter = appendRelationshipToGraph();

        relationship = relationshipEnter.relationship.merge(relationship);

        relationshipOutline = svg.selectAll('.relationship .outline');
        relationshipOutline = relationshipEnter.outline.merge(relationshipOutline);

        relationshipOverlay = svg.selectAll('.relationship .overlay');
        relationshipOverlay = relationshipEnter.overlay.merge(relationshipOverlay);

        relationshipText = svg.selectAll('.relationship .text');
        relationshipText = relationshipEnter.text.merge(relationshipText);
    }

    function version() {
        return VERSION;
    }

    function zoomFit(transitionDuration) {
        var bounds = svg.node().getBBox(),
            parent = svg.node().parentElement.parentElement,
            fullWidth = parent.clientWidth,
            fullHeight = parent.clientHeight,
            width = bounds.width,
            height = bounds.height,
            midX = bounds.x + width / 2,
            midY = bounds.y + height / 2;

        if (width === 0 || height === 0) {
            return; // nothing to fit
        }

        svgScale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
        svgTranslate = [fullWidth / 2 - svgScale * midX, fullHeight / 2 - svgScale * midY];

        svg.attr('transform', 'translate(' + svgTranslate[0] + ', ' + svgTranslate[1] + ') scale(' + svgScale + ')');
        //        smoothTransform(svgTranslate, svgScale);
    }
    //没用
    function loadNeo4jDataFromUrlNew() {
        nodes = [];
        relationships = [];
        var t = 'json/temp.json';
        d3.json(t, function (error, data) {
            if (error) {
                throw error;
            }
            var d3Data = neo4jDataToD3Data(data);
            updateWithD3Data(data);
        });
    }
    //有用
    function getTempNode(d) {
        //loadNeo4jDataFromUrlNew(tempDataUrl);
        var data = {
            nodes: [
                {
                    "id": "1",
                    "labels": ["User"],
                    "properties": {
                        "userId": "eisman"
                    }
                },
                {
                    "id": "8",
                    "labels": ["Project"],
                    "properties": {
                        "name": "neo4jd3",
                        "title": "neo4jd3.js",
                        "description": "Neo4j graph visualization using D3.js.",
                        "url": "https://eisman.github.io/neo4jd3"
                    }
                },
                {
                    "id": "9",
                    "labels": ["Usefffr"],
                    "properties": {
                        "userId": "eisman"
                    }
                }
            ],
            relationships: [
                {
                    "id": "7",
                    "type": "DEVELOPES",
                    "startNode": "1",
                    "endNode": "8",
                    "properties": {
                        "from": 1470002400000
                    },
                    "source": "1",
                    "target": "8",
                    "linknum": 1
                },
                {
                    "id": "8",
                    "type": "DEVELOPES",
                    "startNode": "8",
                    "endNode": "9",
                    "properties": {
                        "from": 1470002400000
                    },
                    "source": "8",
                    "target": "9",
                    "linknum": 2
                }
            ]
        };
        nodes = [];
        relationships = [];
        var t = 'json/temp.json';
        var temp = {
            nodes: [],
            relationships: []
        };
        var i,
            j,
            node,
            relationship,
            indexnode = 0,
            indexrelationship = 0;

        temp.nodes[temp.nodes.length] = d;

        for (i = 0; i < data.relationships.length; i++) {
            if (data.relationships[i].startNode === d.id) {
                for (j = 0; j < data.nodes.length; j++) {
                    if (data.nodes[j].id === data.relationships[i].endNode) {
                        node = data.nodes[j];
                        relationship = data.relationships[i];
                        node.x = d.x;
                        node.y = d.y;
                        //  alert(node.x);
                        // alert(111);
                        // alert(node.y);
                        temp.nodes[temp.nodes.length] = node;
                        temp.relationships[temp.relationships.length] = data.relationships[i];
                        indexnode++;
                        indexrelationship++;
                        // alert(temp.nodes.length);
                    }
                }
            }
        }
        return temp;

    }

    init(_selector, _options);
    //新加的getTempNode: getTempNode（用了）   loadNeo4jDataFromUrlNew: loadNeo4jDataFromUrlNew（没用）
    return {
        appendRandomDataToNode: appendRandomDataToNode,
        neo4jDataToD3Data: neo4jDataToD3Data,
        randomD3Data: randomD3Data,
        size: size,
        updateWithD3Data: updateWithD3Data,
        updateWithNeo4jData: updateWithNeo4jData,
        version: version,
        getTempNode: getTempNode,
        loadNeo4jDataFromUrlNew: loadNeo4jDataFromUrlNew
    };
}

module.exports = Neo4jD3;

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9pbmRleC5qcyIsInNyYy9tYWluL3NjcmlwdHMvbmVvNGpkMy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmVvNGpkMyA9IHJlcXVpcmUoJy4vc2NyaXB0cy9uZW80amQzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmVvNGpkMztcbiIsIi8qIGdsb2JhbCBkMywgZG9jdW1lbnQgKi9cclxuLyoganNoaW50IGxhdGVkZWY6bm9mdW5jICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIE5lbzRqRDMoX3NlbGVjdG9yLCBfb3B0aW9ucykge1xyXG4gICAgdmFyIGNvbnRhaW5lciwgZ3JhcGgsIGluZm8sIG5vZGUsIG5vZGVzLCByZWxhdGlvbnNoaXAsIHJlbGF0aW9uc2hpcE91dGxpbmUsIHJlbGF0aW9uc2hpcE92ZXJsYXksIHJlbGF0aW9uc2hpcFRleHQsIHJlbGF0aW9uc2hpcHMsIHNlbGVjdG9yLCBzaW11bGF0aW9uLCBzdmcsIHN2Z05vZGVzLCBzdmdSZWxhdGlvbnNoaXBzLCBzdmdTY2FsZSwgc3ZnVHJhbnNsYXRlLFxyXG4gICAgICAgIGNsYXNzZXMyY29sb3JzID0ge30sXHJcbiAgICAgICAganVzdExvYWRlZCA9IGZhbHNlLFxyXG4gICAgICAgIG51bUNsYXNzZXMgPSAwLFxyXG4gICAgICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGFycm93U2l6ZTogNCxcclxuICAgICAgICAgICAgY29sb3JzOiBjb2xvcnMoKSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGljb25NYXA6IGZvbnRBd2Vzb21lSWNvbnMoKSxcclxuICAgICAgICAgICAgaWNvbnM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgaW1hZ2VNYXA6IHt9LFxyXG4gICAgICAgICAgICBpbWFnZXM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgaW5mb1BhbmVsOiB0cnVlLFxyXG4gICAgICAgICAgICBtaW5Db2xsaXNpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbmVvNGpEYXRhOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIG5lbzRqRGF0YVVybDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICB0ZW1wRGF0YVVybDogdW5kZWZpbmVkLCAvL+aWsOWKoOeahOayoeeUqFxyXG4gICAgICAgICAgICBub2RlT3V0bGluZUZpbGxDb2xvcjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBub2RlUmFkaXVzOiAyNSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwQ29sb3I6ICcjYTVhYmI2JyxcclxuICAgICAgICAgICAgem9vbUZpdDogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIFZFUlNJT04gPSAnMC4wLjEnO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZEdyYXBoKGNvbnRhaW5lcikge1xyXG4gICAgICAgIHN2ZyA9IGNvbnRhaW5lci5hcHBlbmQoJ3N2ZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsICcxMDAlJylcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsICcxMDAlJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMtZ3JhcGgnKVxyXG4gICAgICAgICAgICAuY2FsbChkMy56b29tKCkub24oJ3pvb20nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSBkMy5ldmVudC50cmFuc2Zvcm0uayxcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUgPSBbZDMuZXZlbnQudHJhbnNmb3JtLngsIGQzLmV2ZW50LnRyYW5zZm9ybS55XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3ZnVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlWzBdICs9IHN2Z1RyYW5zbGF0ZVswXTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVbMV0gKz0gc3ZnVHJhbnNsYXRlWzFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdmdTY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlICo9IHN2Z1NjYWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHN2Zy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB0cmFuc2xhdGVbMF0gKyAnLCAnICsgdHJhbnNsYXRlWzFdICsgJykgc2NhbGUoJyArIHNjYWxlICsgJyknKTtcclxuICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgIC5vbignZGJsY2xpY2suem9vbScsIG51bGwpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAnMTAwJScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAnMTAwJScpO1xyXG5cclxuICAgICAgICBzdmdSZWxhdGlvbnNoaXBzID0gc3ZnLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdyZWxhdGlvbnNoaXBzJyk7XHJcblxyXG4gICAgICAgIHN2Z05vZGVzID0gc3ZnLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdub2RlcycpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZEltYWdlVG9Ob2RlKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ2ltYWdlJylcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWNvbihkKSA/ICcyNHB4JyA6ICczMHB4JztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGljb24oZCkgPyAnNXB4JyA6ICctMTVweCc7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZShkKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGljb24oZCkgPyAnNXB4JyA6ICctMTZweCc7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWNvbihkKSA/ICcyNHB4JyA6ICczMHB4JztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kSW5mb1BhbmVsKGNvbnRhaW5lcikge1xyXG4gICAgICAgIHJldHVybiBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbmVvNGpkMy1pbmZvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCBpc05vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xyXG4gICAgICAgIHZhciBlbGVtID0gaW5mby5hcHBlbmQoJ2EnKTtcclxuXHJcbiAgICAgICAgZWxlbS5hdHRyKCdocmVmJywgJyMnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBjbHMpXHJcbiAgICAgICAgICAgIC5odG1sKCc8c3Ryb25nPicgKyBwcm9wZXJ0eSArICc8L3N0cm9uZz4nICsgKHZhbHVlID8gKCc6ICcgKyB2YWx1ZSkgOiAnJykpO1xyXG5cclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIGVsZW0uc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yIDogKGlzTm9kZSA/IGNsYXNzMmNvbG9yKHByb3BlcnR5KSA6IGRlZmF1bHRDb2xvcigpKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5zdHlsZSgnYm9yZGVyLWNvbG9yJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IGNsYXNzMmRhcmtlbkNvbG9yKG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IpIDogKGlzTm9kZSA/IGNsYXNzMmRhcmtlbkNvbG9yKHByb3BlcnR5KSA6IGRlZmF1bHREYXJrZW5Db2xvcigpKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2NvbG9yJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IGNsYXNzMmRhcmtlbkNvbG9yKG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IpIDogJyNmZmYnO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZEluZm9FbGVtZW50Q2xhc3MoY2xzLCBub2RlKSB7XHJcbiAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCB0cnVlLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRJbmZvRWxlbWVudFByb3BlcnR5KGNscywgcHJvcGVydHksIHZhbHVlKSB7XHJcbiAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCBmYWxzZSwgcHJvcGVydHksIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRJbmZvRWxlbWVudFJlbGF0aW9uc2hpcChjbHMsIHJlbGF0aW9uc2hpcCkge1xyXG4gICAgICAgIGFwcGVuZEluZm9FbGVtZW50KGNscywgZmFsc2UsIHJlbGF0aW9uc2hpcCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kTm9kZSgpIHtcclxuICAgICAgICByZXR1cm4gbm9kZS5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhpZ2hsaWdodCwgaSxcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzID0gJ25vZGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsID0gZC5sYWJlbHNbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGljb24oZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzICs9ICcgbm9kZS1pY29uJztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2UoZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzICs9ICcgbm9kZS1pbWFnZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdGlvbnMuaGlnaGxpZ2h0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodCA9IG9wdGlvbnMuaGlnaGxpZ2h0W2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQubGFiZWxzWzBdID09PSBoaWdobGlnaHQuY2xhc3MgJiYgZC5wcm9wZXJ0aWVzW2hpZ2hsaWdodC5wcm9wZXJ0eV0gPT09IGhpZ2hsaWdodC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaGlnaGxpZ2h0ZWQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXM7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgZC5meCA9IGQuZnkgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vbk5vZGVDbGljayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25Ob2RlQ2xpY2soZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignZGJsY2xpY2snLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgc3RpY2tOb2RlKGQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vbk5vZGVEb3VibGVDbGljayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25Ob2RlRG91YmxlQ2xpY2soZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUluZm8oZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZU1vdXNlRW50ZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uTm9kZU1vdXNlRW50ZXIoZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW5mbyhkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMub25Ob2RlTW91c2VMZWF2ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25Ob2RlTW91c2VMZWF2ZShkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhbGwoZDMuZHJhZygpXHJcbiAgICAgICAgICAgICAgICAub24oJ3N0YXJ0JywgZHJhZ1N0YXJ0ZWQpXHJcbiAgICAgICAgICAgICAgICAub24oJ2RyYWcnLCBkcmFnZ2VkKVxyXG4gICAgICAgICAgICAgICAgLm9uKCdlbmQnLCBkcmFnRW5kZWQpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmROb2RlVG9HcmFwaCgpIHtcclxuICAgICAgICB2YXIgbiA9IGFwcGVuZE5vZGUoKTtcclxuXHJcbiAgICAgICAgYXBwZW5kUmluZ1RvTm9kZShuKTtcclxuICAgICAgICBhcHBlbmRPdXRsaW5lVG9Ob2RlKG4pO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5pY29ucykge1xyXG4gICAgICAgICAgICBhcHBlbmRUZXh0VG9Ob2RlKG4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIGFwcGVuZEltYWdlVG9Ob2RlKG4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kT3V0bGluZVRvTm9kZShub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCdjaXJjbGUnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnb3V0bGluZScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdyJywgb3B0aW9ucy5ub2RlUmFkaXVzKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yIDogY2xhc3MyY29sb3IoZC5sYWJlbHNbMF0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IGNsYXNzMmRhcmtlbkNvbG9yKG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IpIDogY2xhc3MyZGFya2VuQ29sb3IoZC5sYWJlbHNbMF0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXBwZW5kKCd0aXRsZScpLnRleHQoZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b1N0cmluZyhkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kUmluZ1RvTm9kZShub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuYXBwZW5kKCdjaXJjbGUnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncmluZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdyJywgb3B0aW9ucy5ub2RlUmFkaXVzICogMS4xNilcclxuICAgICAgICAgICAgLmFwcGVuZCgndGl0bGUnKS50ZXh0KGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9TdHJpbmcoZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZFRleHRUb05vZGUobm9kZSkge1xyXG4gICAgICAgIHJldHVybiBub2RlLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3RleHQnICsgKGljb24oZCkgPyAnIGljb24nIDogJycpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICcjZmZmZmZmJylcclxuICAgICAgICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWNvbihkKSA/IChvcHRpb25zLm5vZGVSYWRpdXMgKyAncHgnKSA6ICcxMHB4JztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxyXG4gICAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcclxuICAgICAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGljb24oZCkgPyAocGFyc2VJbnQoTWF0aC5yb3VuZChvcHRpb25zLm5vZGVSYWRpdXMgKiAwLjMyKSkgKyAncHgnKSA6ICc0cHgnO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuaHRtbChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9pY29uID0gaWNvbihkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfaWNvbiA/ICcmI3gnICsgX2ljb24gOiBkLmlkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRSYW5kb21EYXRhVG9Ob2RlKGQsIG1heE5vZGVzVG9HZW5lcmF0ZSkge1xyXG4gICAgICAgIHZhciBkYXRhID0gcmFuZG9tRDNEYXRhKGQsIG1heE5vZGVzVG9HZW5lcmF0ZSk7XHJcbiAgICAgICAgdXBkYXRlV2l0aE5lbzRqRGF0YShkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRSZWxhdGlvbnNoaXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncmVsYXRpb25zaGlwJylcclxuICAgICAgICAgICAgLm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMub25SZWxhdGlvbnNoaXBEb3VibGVDbGljayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25SZWxhdGlvbnNoaXBEb3VibGVDbGljayhkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5mbyhkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kT3V0bGluZVRvUmVsYXRpb25zaGlwKHIpIHtcclxuICAgICAgICByZXR1cm4gci5hcHBlbmQoJ3BhdGgnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnb3V0bGluZScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJyNhNWFiYjYnKVxyXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlJywgJ25vbmUnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRPdmVybGF5VG9SZWxhdGlvbnNoaXAocikge1xyXG4gICAgICAgIHJldHVybiByLmFwcGVuZCgncGF0aCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdvdmVybGF5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kVGV4dFRvUmVsYXRpb25zaGlwKHIpIHtcclxuICAgICAgICByZXR1cm4gci5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGV4dCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJyMwMDAwMDAnKVxyXG4gICAgICAgICAgICAuYXR0cignZm9udC1zaXplJywgJzhweCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcclxuICAgICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZC50eXBlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRSZWxhdGlvbnNoaXBUb0dyYXBoKCkge1xyXG4gICAgICAgIHZhciByZWxhdGlvbnNoaXAgPSBhcHBlbmRSZWxhdGlvbnNoaXAoKSxcclxuICAgICAgICAgICAgdGV4dCA9IGFwcGVuZFRleHRUb1JlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApLFxyXG4gICAgICAgICAgICBvdXRsaW5lID0gYXBwZW5kT3V0bGluZVRvUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCksXHJcbiAgICAgICAgICAgIG92ZXJsYXkgPSBhcHBlbmRPdmVybGF5VG9SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgb3V0bGluZTogb3V0bGluZSxcclxuICAgICAgICAgICAgb3ZlcmxheTogb3ZlcmxheSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwOiByZWxhdGlvbnNoaXAsXHJcbiAgICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsYXNzMmNvbG9yKGNscykge1xyXG4gICAgICAgIHZhciBjb2xvciA9IGNsYXNzZXMyY29sb3JzW2Nsc107XHJcblxyXG4gICAgICAgIGlmICghY29sb3IpIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICBjb2xvciA9IG9wdGlvbnMuY29sb3JzW01hdGgubWluKG51bUNsYXNzZXMsIG9wdGlvbnMuY29sb3JzLmxlbmd0aCAtIDEpXTtcclxuICAgICAgICAgICAgY29sb3IgPSBvcHRpb25zLmNvbG9yc1tudW1DbGFzc2VzICUgb3B0aW9ucy5jb2xvcnMubGVuZ3RoXTtcclxuICAgICAgICAgICAgY2xhc3NlczJjb2xvcnNbY2xzXSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBudW1DbGFzc2VzKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xhc3MyZGFya2VuQ29sb3IoY2xzKSB7XHJcbiAgICAgICAgcmV0dXJuIGQzLnJnYihjbGFzczJjb2xvcihjbHMpKS5kYXJrZXIoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYXJJbmZvKCkge1xyXG4gICAgICAgIGluZm8uaHRtbCgnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29sb3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29sb3JzW29wdGlvbnMuY29sb3JzLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkgPDwgMF07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29sb3JzKCkge1xyXG4gICAgICAgIC8vIGQzLnNjaGVtZUNhdGVnb3J5MTAsXHJcbiAgICAgICAgLy8gZDMuc2NoZW1lQ2F0ZWdvcnkyMCxcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAnIzY4YmRmNicsIC8vIGxpZ2h0IGJsdWVcclxuICAgICAgICAgICAgJyM2ZGNlOWUnLCAvLyBncmVlbiAjMVxyXG4gICAgICAgICAgICAnI2ZhYWZjMicsIC8vIGxpZ2h0IHBpbmtcclxuICAgICAgICAgICAgJyNmMmJhZjYnLCAvLyBwdXJwbGVcclxuICAgICAgICAgICAgJyNmZjkyOGMnLCAvLyBsaWdodCByZWRcclxuICAgICAgICAgICAgJyNmY2VhN2UnLCAvLyBsaWdodCB5ZWxsb3dcclxuICAgICAgICAgICAgJyNmZmM3NjYnLCAvLyBsaWdodCBvcmFuZ2VcclxuICAgICAgICAgICAgJyM0MDVmOWUnLCAvLyBuYXZ5IGJsdWVcclxuICAgICAgICAgICAgJyNhNWFiYjYnLCAvLyBkYXJrIGdyYXlcclxuICAgICAgICAgICAgJyM3OGNlY2InLCAvLyBncmVlbiAjMixcclxuICAgICAgICAgICAgJyNiODhjYmInLCAvLyBkYXJrIHB1cnBsZVxyXG4gICAgICAgICAgICAnI2NlZDJkOScsIC8vIGxpZ2h0IGdyYXlcclxuICAgICAgICAgICAgJyNlODQ2NDYnLCAvLyBkYXJrIHJlZFxyXG4gICAgICAgICAgICAnI2ZhNWY4NicsIC8vIGRhcmsgcGlua1xyXG4gICAgICAgICAgICAnI2ZmYWIxYScsIC8vIGRhcmsgb3JhbmdlXHJcbiAgICAgICAgICAgICcjZmNkYTE5JywgLy8gZGFyayB5ZWxsb3dcclxuICAgICAgICAgICAgJyM3OTdiODAnLCAvLyBibGFja1xyXG4gICAgICAgICAgICAnI2M5ZDk2ZicsIC8vIHBpc3RhY2NoaW9cclxuICAgICAgICAgICAgJyM0Nzk5MWYnLCAvLyBncmVlbiAjM1xyXG4gICAgICAgICAgICAnIzcwZWRlZScsIC8vIHR1cnF1b2lzZVxyXG4gICAgICAgICAgICAnI2ZmNzVlYScgIC8vIHBpbmtcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRhaW5zKGFycmF5LCBpZCkge1xyXG4gICAgICAgIHZhciBmaWx0ZXIgPSBhcnJheS5maWx0ZXIoZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW0uaWQgPT09IGlkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZmlsdGVyLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVmYXVsdENvbG9yKCkge1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zLnJlbGF0aW9uc2hpcENvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRlZmF1bHREYXJrZW5Db2xvcigpIHtcclxuICAgICAgICByZXR1cm4gZDMucmdiKG9wdGlvbnMuY29sb3JzW29wdGlvbnMuY29sb3JzLmxlbmd0aCAtIDFdKS5kYXJrZXIoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhZ0VuZGVkKGQpIHtcclxuICAgICAgICBpZiAoIWQzLmV2ZW50LmFjdGl2ZSkge1xyXG4gICAgICAgICAgICBzaW11bGF0aW9uLmFscGhhVGFyZ2V0KDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZURyYWdFbmQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5vbk5vZGVEcmFnRW5kKGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkcmFnZ2VkKGQpIHtcclxuICAgICAgICBzdGlja05vZGUoZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhZ1N0YXJ0ZWQoZCkge1xyXG4gICAgICAgIGlmICghZDMuZXZlbnQuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIHNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMC4zKS5yZXN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkLmZ4ID0gZC54O1xyXG4gICAgICAgIGQuZnkgPSBkLnk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vbk5vZGVEcmFnU3RhcnQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5vbk5vZGVEcmFnU3RhcnQoZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy/mlLnkuobkvYbmmK/msqHnlKhcclxuICAgIGZ1bmN0aW9uIGV4dGVuZChkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgbm9kZXM6IFtdLFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzOiBbXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgIGxhYmVsLFxyXG4gICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICBudW1Ob2RlcyA9IChtYXhOb2Rlc1RvR2VuZXJhdGUgKiBNYXRoLnJhbmRvbSgpIDw8IDApICsgMSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxyXG4gICAgICAgICAgICBzID0gc2l6ZSgpO1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtTm9kZXM7IGkrKykge1xyXG4gICAgICAgICAgICBsYWJlbCA9IHJhbmRvbUxhYmVsKCk7XHJcblxyXG4gICAgICAgICAgICBub2RlID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHMubm9kZXMgKyAxICsgaSxcclxuICAgICAgICAgICAgICAgIGxhYmVsczogW2xhYmVsXSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICByYW5kb206IGxhYmVsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeDogZC54LFxyXG4gICAgICAgICAgICAgICAgeTogZC55XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBkYXRhLm5vZGVzW2RhdGEubm9kZXMubGVuZ3RoXSA9IG5vZGU7XHJcblxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAgPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogcy5yZWxhdGlvbnNoaXBzICsgMSArIGksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBsYWJlbC50b1VwcGVyQ2FzZSgpLFxyXG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBkLmlkLFxyXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogcy5ub2RlcyArIDEgKyBpLFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb206IERhdGUubm93KClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGQuaWQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHMubm9kZXMgKyAxICsgaSxcclxuICAgICAgICAgICAgICAgIGxpbmtudW06IHMucmVsYXRpb25zaGlwcyArIDEgKyBpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBkYXRhLnJlbGF0aW9uc2hpcHNbZGF0YS5yZWxhdGlvbnNoaXBzLmxlbmd0aF0gPSByZWxhdGlvbnNoaXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmb250QXdlc29tZUljb25zKCkge1xyXG4gICAgICAgIHJldHVybiB7ICdnbGFzcyc6ICdmMDAwJywgJ211c2ljJzogJ2YwMDEnLCAnc2VhcmNoJzogJ2YwMDInLCAnZW52ZWxvcGUtbyc6ICdmMDAzJywgJ2hlYXJ0JzogJ2YwMDQnLCAnc3Rhcic6ICdmMDA1JywgJ3N0YXItbyc6ICdmMDA2JywgJ3VzZXInOiAnZjAwNycsICdmaWxtJzogJ2YwMDgnLCAndGgtbGFyZ2UnOiAnZjAwOScsICd0aCc6ICdmMDBhJywgJ3RoLWxpc3QnOiAnZjAwYicsICdjaGVjayc6ICdmMDBjJywgJ3JlbW92ZSxjbG9zZSx0aW1lcyc6ICdmMDBkJywgJ3NlYXJjaC1wbHVzJzogJ2YwMGUnLCAnc2VhcmNoLW1pbnVzJzogJ2YwMTAnLCAncG93ZXItb2ZmJzogJ2YwMTEnLCAnc2lnbmFsJzogJ2YwMTInLCAnZ2Vhcixjb2cnOiAnZjAxMycsICd0cmFzaC1vJzogJ2YwMTQnLCAnaG9tZSc6ICdmMDE1JywgJ2ZpbGUtbyc6ICdmMDE2JywgJ2Nsb2NrLW8nOiAnZjAxNycsICdyb2FkJzogJ2YwMTgnLCAnZG93bmxvYWQnOiAnZjAxOScsICdhcnJvdy1jaXJjbGUtby1kb3duJzogJ2YwMWEnLCAnYXJyb3ctY2lyY2xlLW8tdXAnOiAnZjAxYicsICdpbmJveCc6ICdmMDFjJywgJ3BsYXktY2lyY2xlLW8nOiAnZjAxZCcsICdyb3RhdGUtcmlnaHQscmVwZWF0JzogJ2YwMWUnLCAncmVmcmVzaCc6ICdmMDIxJywgJ2xpc3QtYWx0JzogJ2YwMjInLCAnbG9jayc6ICdmMDIzJywgJ2ZsYWcnOiAnZjAyNCcsICdoZWFkcGhvbmVzJzogJ2YwMjUnLCAndm9sdW1lLW9mZic6ICdmMDI2JywgJ3ZvbHVtZS1kb3duJzogJ2YwMjcnLCAndm9sdW1lLXVwJzogJ2YwMjgnLCAncXJjb2RlJzogJ2YwMjknLCAnYmFyY29kZSc6ICdmMDJhJywgJ3RhZyc6ICdmMDJiJywgJ3RhZ3MnOiAnZjAyYycsICdib29rJzogJ2YwMmQnLCAnYm9va21hcmsnOiAnZjAyZScsICdwcmludCc6ICdmMDJmJywgJ2NhbWVyYSc6ICdmMDMwJywgJ2ZvbnQnOiAnZjAzMScsICdib2xkJzogJ2YwMzInLCAnaXRhbGljJzogJ2YwMzMnLCAndGV4dC1oZWlnaHQnOiAnZjAzNCcsICd0ZXh0LXdpZHRoJzogJ2YwMzUnLCAnYWxpZ24tbGVmdCc6ICdmMDM2JywgJ2FsaWduLWNlbnRlcic6ICdmMDM3JywgJ2FsaWduLXJpZ2h0JzogJ2YwMzgnLCAnYWxpZ24tanVzdGlmeSc6ICdmMDM5JywgJ2xpc3QnOiAnZjAzYScsICdkZWRlbnQsb3V0ZGVudCc6ICdmMDNiJywgJ2luZGVudCc6ICdmMDNjJywgJ3ZpZGVvLWNhbWVyYSc6ICdmMDNkJywgJ3Bob3RvLGltYWdlLHBpY3R1cmUtbyc6ICdmMDNlJywgJ3BlbmNpbCc6ICdmMDQwJywgJ21hcC1tYXJrZXInOiAnZjA0MScsICdhZGp1c3QnOiAnZjA0MicsICd0aW50JzogJ2YwNDMnLCAnZWRpdCxwZW5jaWwtc3F1YXJlLW8nOiAnZjA0NCcsICdzaGFyZS1zcXVhcmUtbyc6ICdmMDQ1JywgJ2NoZWNrLXNxdWFyZS1vJzogJ2YwNDYnLCAnYXJyb3dzJzogJ2YwNDcnLCAnc3RlcC1iYWNrd2FyZCc6ICdmMDQ4JywgJ2Zhc3QtYmFja3dhcmQnOiAnZjA0OScsICdiYWNrd2FyZCc6ICdmMDRhJywgJ3BsYXknOiAnZjA0YicsICdwYXVzZSc6ICdmMDRjJywgJ3N0b3AnOiAnZjA0ZCcsICdmb3J3YXJkJzogJ2YwNGUnLCAnZmFzdC1mb3J3YXJkJzogJ2YwNTAnLCAnc3RlcC1mb3J3YXJkJzogJ2YwNTEnLCAnZWplY3QnOiAnZjA1MicsICdjaGV2cm9uLWxlZnQnOiAnZjA1MycsICdjaGV2cm9uLXJpZ2h0JzogJ2YwNTQnLCAncGx1cy1jaXJjbGUnOiAnZjA1NScsICdtaW51cy1jaXJjbGUnOiAnZjA1NicsICd0aW1lcy1jaXJjbGUnOiAnZjA1NycsICdjaGVjay1jaXJjbGUnOiAnZjA1OCcsICdxdWVzdGlvbi1jaXJjbGUnOiAnZjA1OScsICdpbmZvLWNpcmNsZSc6ICdmMDVhJywgJ2Nyb3NzaGFpcnMnOiAnZjA1YicsICd0aW1lcy1jaXJjbGUtbyc6ICdmMDVjJywgJ2NoZWNrLWNpcmNsZS1vJzogJ2YwNWQnLCAnYmFuJzogJ2YwNWUnLCAnYXJyb3ctbGVmdCc6ICdmMDYwJywgJ2Fycm93LXJpZ2h0JzogJ2YwNjEnLCAnYXJyb3ctdXAnOiAnZjA2MicsICdhcnJvdy1kb3duJzogJ2YwNjMnLCAnbWFpbC1mb3J3YXJkLHNoYXJlJzogJ2YwNjQnLCAnZXhwYW5kJzogJ2YwNjUnLCAnY29tcHJlc3MnOiAnZjA2NicsICdwbHVzJzogJ2YwNjcnLCAnbWludXMnOiAnZjA2OCcsICdhc3Rlcmlzayc6ICdmMDY5JywgJ2V4Y2xhbWF0aW9uLWNpcmNsZSc6ICdmMDZhJywgJ2dpZnQnOiAnZjA2YicsICdsZWFmJzogJ2YwNmMnLCAnZmlyZSc6ICdmMDZkJywgJ2V5ZSc6ICdmMDZlJywgJ2V5ZS1zbGFzaCc6ICdmMDcwJywgJ3dhcm5pbmcsZXhjbGFtYXRpb24tdHJpYW5nbGUnOiAnZjA3MScsICdwbGFuZSc6ICdmMDcyJywgJ2NhbGVuZGFyJzogJ2YwNzMnLCAncmFuZG9tJzogJ2YwNzQnLCAnY29tbWVudCc6ICdmMDc1JywgJ21hZ25ldCc6ICdmMDc2JywgJ2NoZXZyb24tdXAnOiAnZjA3NycsICdjaGV2cm9uLWRvd24nOiAnZjA3OCcsICdyZXR3ZWV0JzogJ2YwNzknLCAnc2hvcHBpbmctY2FydCc6ICdmMDdhJywgJ2ZvbGRlcic6ICdmMDdiJywgJ2ZvbGRlci1vcGVuJzogJ2YwN2MnLCAnYXJyb3dzLXYnOiAnZjA3ZCcsICdhcnJvd3MtaCc6ICdmMDdlJywgJ2Jhci1jaGFydC1vLGJhci1jaGFydCc6ICdmMDgwJywgJ3R3aXR0ZXItc3F1YXJlJzogJ2YwODEnLCAnZmFjZWJvb2stc3F1YXJlJzogJ2YwODInLCAnY2FtZXJhLXJldHJvJzogJ2YwODMnLCAna2V5JzogJ2YwODQnLCAnZ2VhcnMsY29ncyc6ICdmMDg1JywgJ2NvbW1lbnRzJzogJ2YwODYnLCAndGh1bWJzLW8tdXAnOiAnZjA4NycsICd0aHVtYnMtby1kb3duJzogJ2YwODgnLCAnc3Rhci1oYWxmJzogJ2YwODknLCAnaGVhcnQtbyc6ICdmMDhhJywgJ3NpZ24tb3V0JzogJ2YwOGInLCAnbGlua2VkaW4tc3F1YXJlJzogJ2YwOGMnLCAndGh1bWItdGFjayc6ICdmMDhkJywgJ2V4dGVybmFsLWxpbmsnOiAnZjA4ZScsICdzaWduLWluJzogJ2YwOTAnLCAndHJvcGh5JzogJ2YwOTEnLCAnZ2l0aHViLXNxdWFyZSc6ICdmMDkyJywgJ3VwbG9hZCc6ICdmMDkzJywgJ2xlbW9uLW8nOiAnZjA5NCcsICdwaG9uZSc6ICdmMDk1JywgJ3NxdWFyZS1vJzogJ2YwOTYnLCAnYm9va21hcmstbyc6ICdmMDk3JywgJ3Bob25lLXNxdWFyZSc6ICdmMDk4JywgJ3R3aXR0ZXInOiAnZjA5OScsICdmYWNlYm9vay1mLGZhY2Vib29rJzogJ2YwOWEnLCAnZ2l0aHViJzogJ2YwOWInLCAndW5sb2NrJzogJ2YwOWMnLCAnY3JlZGl0LWNhcmQnOiAnZjA5ZCcsICdmZWVkLHJzcyc6ICdmMDllJywgJ2hkZC1vJzogJ2YwYTAnLCAnYnVsbGhvcm4nOiAnZjBhMScsICdiZWxsJzogJ2YwZjMnLCAnY2VydGlmaWNhdGUnOiAnZjBhMycsICdoYW5kLW8tcmlnaHQnOiAnZjBhNCcsICdoYW5kLW8tbGVmdCc6ICdmMGE1JywgJ2hhbmQtby11cCc6ICdmMGE2JywgJ2hhbmQtby1kb3duJzogJ2YwYTcnLCAnYXJyb3ctY2lyY2xlLWxlZnQnOiAnZjBhOCcsICdhcnJvdy1jaXJjbGUtcmlnaHQnOiAnZjBhOScsICdhcnJvdy1jaXJjbGUtdXAnOiAnZjBhYScsICdhcnJvdy1jaXJjbGUtZG93bic6ICdmMGFiJywgJ2dsb2JlJzogJ2YwYWMnLCAnd3JlbmNoJzogJ2YwYWQnLCAndGFza3MnOiAnZjBhZScsICdmaWx0ZXInOiAnZjBiMCcsICdicmllZmNhc2UnOiAnZjBiMScsICdhcnJvd3MtYWx0JzogJ2YwYjInLCAnZ3JvdXAsdXNlcnMnOiAnZjBjMCcsICdjaGFpbixsaW5rJzogJ2YwYzEnLCAnY2xvdWQnOiAnZjBjMicsICdmbGFzayc6ICdmMGMzJywgJ2N1dCxzY2lzc29ycyc6ICdmMGM0JywgJ2NvcHksZmlsZXMtbyc6ICdmMGM1JywgJ3BhcGVyY2xpcCc6ICdmMGM2JywgJ3NhdmUsZmxvcHB5LW8nOiAnZjBjNycsICdzcXVhcmUnOiAnZjBjOCcsICduYXZpY29uLHJlb3JkZXIsYmFycyc6ICdmMGM5JywgJ2xpc3QtdWwnOiAnZjBjYScsICdsaXN0LW9sJzogJ2YwY2InLCAnc3RyaWtldGhyb3VnaCc6ICdmMGNjJywgJ3VuZGVybGluZSc6ICdmMGNkJywgJ3RhYmxlJzogJ2YwY2UnLCAnbWFnaWMnOiAnZjBkMCcsICd0cnVjayc6ICdmMGQxJywgJ3BpbnRlcmVzdCc6ICdmMGQyJywgJ3BpbnRlcmVzdC1zcXVhcmUnOiAnZjBkMycsICdnb29nbGUtcGx1cy1zcXVhcmUnOiAnZjBkNCcsICdnb29nbGUtcGx1cyc6ICdmMGQ1JywgJ21vbmV5JzogJ2YwZDYnLCAnY2FyZXQtZG93bic6ICdmMGQ3JywgJ2NhcmV0LXVwJzogJ2YwZDgnLCAnY2FyZXQtbGVmdCc6ICdmMGQ5JywgJ2NhcmV0LXJpZ2h0JzogJ2YwZGEnLCAnY29sdW1ucyc6ICdmMGRiJywgJ3Vuc29ydGVkLHNvcnQnOiAnZjBkYycsICdzb3J0LWRvd24sc29ydC1kZXNjJzogJ2YwZGQnLCAnc29ydC11cCxzb3J0LWFzYyc6ICdmMGRlJywgJ2VudmVsb3BlJzogJ2YwZTAnLCAnbGlua2VkaW4nOiAnZjBlMScsICdyb3RhdGUtbGVmdCx1bmRvJzogJ2YwZTInLCAnbGVnYWwsZ2F2ZWwnOiAnZjBlMycsICdkYXNoYm9hcmQsdGFjaG9tZXRlcic6ICdmMGU0JywgJ2NvbW1lbnQtbyc6ICdmMGU1JywgJ2NvbW1lbnRzLW8nOiAnZjBlNicsICdmbGFzaCxib2x0JzogJ2YwZTcnLCAnc2l0ZW1hcCc6ICdmMGU4JywgJ3VtYnJlbGxhJzogJ2YwZTknLCAncGFzdGUsY2xpcGJvYXJkJzogJ2YwZWEnLCAnbGlnaHRidWxiLW8nOiAnZjBlYicsICdleGNoYW5nZSc6ICdmMGVjJywgJ2Nsb3VkLWRvd25sb2FkJzogJ2YwZWQnLCAnY2xvdWQtdXBsb2FkJzogJ2YwZWUnLCAndXNlci1tZCc6ICdmMGYwJywgJ3N0ZXRob3Njb3BlJzogJ2YwZjEnLCAnc3VpdGNhc2UnOiAnZjBmMicsICdiZWxsLW8nOiAnZjBhMicsICdjb2ZmZWUnOiAnZjBmNCcsICdjdXRsZXJ5JzogJ2YwZjUnLCAnZmlsZS10ZXh0LW8nOiAnZjBmNicsICdidWlsZGluZy1vJzogJ2YwZjcnLCAnaG9zcGl0YWwtbyc6ICdmMGY4JywgJ2FtYnVsYW5jZSc6ICdmMGY5JywgJ21lZGtpdCc6ICdmMGZhJywgJ2ZpZ2h0ZXItamV0JzogJ2YwZmInLCAnYmVlcic6ICdmMGZjJywgJ2gtc3F1YXJlJzogJ2YwZmQnLCAncGx1cy1zcXVhcmUnOiAnZjBmZScsICdhbmdsZS1kb3VibGUtbGVmdCc6ICdmMTAwJywgJ2FuZ2xlLWRvdWJsZS1yaWdodCc6ICdmMTAxJywgJ2FuZ2xlLWRvdWJsZS11cCc6ICdmMTAyJywgJ2FuZ2xlLWRvdWJsZS1kb3duJzogJ2YxMDMnLCAnYW5nbGUtbGVmdCc6ICdmMTA0JywgJ2FuZ2xlLXJpZ2h0JzogJ2YxMDUnLCAnYW5nbGUtdXAnOiAnZjEwNicsICdhbmdsZS1kb3duJzogJ2YxMDcnLCAnZGVza3RvcCc6ICdmMTA4JywgJ2xhcHRvcCc6ICdmMTA5JywgJ3RhYmxldCc6ICdmMTBhJywgJ21vYmlsZS1waG9uZSxtb2JpbGUnOiAnZjEwYicsICdjaXJjbGUtbyc6ICdmMTBjJywgJ3F1b3RlLWxlZnQnOiAnZjEwZCcsICdxdW90ZS1yaWdodCc6ICdmMTBlJywgJ3NwaW5uZXInOiAnZjExMCcsICdjaXJjbGUnOiAnZjExMScsICdtYWlsLXJlcGx5LHJlcGx5JzogJ2YxMTInLCAnZ2l0aHViLWFsdCc6ICdmMTEzJywgJ2ZvbGRlci1vJzogJ2YxMTQnLCAnZm9sZGVyLW9wZW4tbyc6ICdmMTE1JywgJ3NtaWxlLW8nOiAnZjExOCcsICdmcm93bi1vJzogJ2YxMTknLCAnbWVoLW8nOiAnZjExYScsICdnYW1lcGFkJzogJ2YxMWInLCAna2V5Ym9hcmQtbyc6ICdmMTFjJywgJ2ZsYWctbyc6ICdmMTFkJywgJ2ZsYWctY2hlY2tlcmVkJzogJ2YxMWUnLCAndGVybWluYWwnOiAnZjEyMCcsICdjb2RlJzogJ2YxMjEnLCAnbWFpbC1yZXBseS1hbGwscmVwbHktYWxsJzogJ2YxMjInLCAnc3Rhci1oYWxmLWVtcHR5LHN0YXItaGFsZi1mdWxsLHN0YXItaGFsZi1vJzogJ2YxMjMnLCAnbG9jYXRpb24tYXJyb3cnOiAnZjEyNCcsICdjcm9wJzogJ2YxMjUnLCAnY29kZS1mb3JrJzogJ2YxMjYnLCAndW5saW5rLGNoYWluLWJyb2tlbic6ICdmMTI3JywgJ3F1ZXN0aW9uJzogJ2YxMjgnLCAnaW5mbyc6ICdmMTI5JywgJ2V4Y2xhbWF0aW9uJzogJ2YxMmEnLCAnc3VwZXJzY3JpcHQnOiAnZjEyYicsICdzdWJzY3JpcHQnOiAnZjEyYycsICdlcmFzZXInOiAnZjEyZCcsICdwdXp6bGUtcGllY2UnOiAnZjEyZScsICdtaWNyb3Bob25lJzogJ2YxMzAnLCAnbWljcm9waG9uZS1zbGFzaCc6ICdmMTMxJywgJ3NoaWVsZCc6ICdmMTMyJywgJ2NhbGVuZGFyLW8nOiAnZjEzMycsICdmaXJlLWV4dGluZ3Vpc2hlcic6ICdmMTM0JywgJ3JvY2tldCc6ICdmMTM1JywgJ21heGNkbic6ICdmMTM2JywgJ2NoZXZyb24tY2lyY2xlLWxlZnQnOiAnZjEzNycsICdjaGV2cm9uLWNpcmNsZS1yaWdodCc6ICdmMTM4JywgJ2NoZXZyb24tY2lyY2xlLXVwJzogJ2YxMzknLCAnY2hldnJvbi1jaXJjbGUtZG93bic6ICdmMTNhJywgJ2h0bWw1JzogJ2YxM2InLCAnY3NzMyc6ICdmMTNjJywgJ2FuY2hvcic6ICdmMTNkJywgJ3VubG9jay1hbHQnOiAnZjEzZScsICdidWxsc2V5ZSc6ICdmMTQwJywgJ2VsbGlwc2lzLWgnOiAnZjE0MScsICdlbGxpcHNpcy12JzogJ2YxNDInLCAncnNzLXNxdWFyZSc6ICdmMTQzJywgJ3BsYXktY2lyY2xlJzogJ2YxNDQnLCAndGlja2V0JzogJ2YxNDUnLCAnbWludXMtc3F1YXJlJzogJ2YxNDYnLCAnbWludXMtc3F1YXJlLW8nOiAnZjE0NycsICdsZXZlbC11cCc6ICdmMTQ4JywgJ2xldmVsLWRvd24nOiAnZjE0OScsICdjaGVjay1zcXVhcmUnOiAnZjE0YScsICdwZW5jaWwtc3F1YXJlJzogJ2YxNGInLCAnZXh0ZXJuYWwtbGluay1zcXVhcmUnOiAnZjE0YycsICdzaGFyZS1zcXVhcmUnOiAnZjE0ZCcsICdjb21wYXNzJzogJ2YxNGUnLCAndG9nZ2xlLWRvd24sY2FyZXQtc3F1YXJlLW8tZG93bic6ICdmMTUwJywgJ3RvZ2dsZS11cCxjYXJldC1zcXVhcmUtby11cCc6ICdmMTUxJywgJ3RvZ2dsZS1yaWdodCxjYXJldC1zcXVhcmUtby1yaWdodCc6ICdmMTUyJywgJ2V1cm8sZXVyJzogJ2YxNTMnLCAnZ2JwJzogJ2YxNTQnLCAnZG9sbGFyLHVzZCc6ICdmMTU1JywgJ3J1cGVlLGlucic6ICdmMTU2JywgJ2NueSxybWIseWVuLGpweSc6ICdmMTU3JywgJ3J1YmxlLHJvdWJsZSxydWInOiAnZjE1OCcsICd3b24sa3J3JzogJ2YxNTknLCAnYml0Y29pbixidGMnOiAnZjE1YScsICdmaWxlJzogJ2YxNWInLCAnZmlsZS10ZXh0JzogJ2YxNWMnLCAnc29ydC1hbHBoYS1hc2MnOiAnZjE1ZCcsICdzb3J0LWFscGhhLWRlc2MnOiAnZjE1ZScsICdzb3J0LWFtb3VudC1hc2MnOiAnZjE2MCcsICdzb3J0LWFtb3VudC1kZXNjJzogJ2YxNjEnLCAnc29ydC1udW1lcmljLWFzYyc6ICdmMTYyJywgJ3NvcnQtbnVtZXJpYy1kZXNjJzogJ2YxNjMnLCAndGh1bWJzLXVwJzogJ2YxNjQnLCAndGh1bWJzLWRvd24nOiAnZjE2NScsICd5b3V0dWJlLXNxdWFyZSc6ICdmMTY2JywgJ3lvdXR1YmUnOiAnZjE2NycsICd4aW5nJzogJ2YxNjgnLCAneGluZy1zcXVhcmUnOiAnZjE2OScsICd5b3V0dWJlLXBsYXknOiAnZjE2YScsICdkcm9wYm94JzogJ2YxNmInLCAnc3RhY2stb3ZlcmZsb3cnOiAnZjE2YycsICdpbnN0YWdyYW0nOiAnZjE2ZCcsICdmbGlja3InOiAnZjE2ZScsICdhZG4nOiAnZjE3MCcsICdiaXRidWNrZXQnOiAnZjE3MScsICdiaXRidWNrZXQtc3F1YXJlJzogJ2YxNzInLCAndHVtYmxyJzogJ2YxNzMnLCAndHVtYmxyLXNxdWFyZSc6ICdmMTc0JywgJ2xvbmctYXJyb3ctZG93bic6ICdmMTc1JywgJ2xvbmctYXJyb3ctdXAnOiAnZjE3NicsICdsb25nLWFycm93LWxlZnQnOiAnZjE3NycsICdsb25nLWFycm93LXJpZ2h0JzogJ2YxNzgnLCAnYXBwbGUnOiAnZjE3OScsICd3aW5kb3dzJzogJ2YxN2EnLCAnYW5kcm9pZCc6ICdmMTdiJywgJ2xpbnV4JzogJ2YxN2MnLCAnZHJpYmJibGUnOiAnZjE3ZCcsICdza3lwZSc6ICdmMTdlJywgJ2ZvdXJzcXVhcmUnOiAnZjE4MCcsICd0cmVsbG8nOiAnZjE4MScsICdmZW1hbGUnOiAnZjE4MicsICdtYWxlJzogJ2YxODMnLCAnZ2l0dGlwLGdyYXRpcGF5JzogJ2YxODQnLCAnc3VuLW8nOiAnZjE4NScsICdtb29uLW8nOiAnZjE4NicsICdhcmNoaXZlJzogJ2YxODcnLCAnYnVnJzogJ2YxODgnLCAndmsnOiAnZjE4OScsICd3ZWlibyc6ICdmMThhJywgJ3JlbnJlbic6ICdmMThiJywgJ3BhZ2VsaW5lcyc6ICdmMThjJywgJ3N0YWNrLWV4Y2hhbmdlJzogJ2YxOGQnLCAnYXJyb3ctY2lyY2xlLW8tcmlnaHQnOiAnZjE4ZScsICdhcnJvdy1jaXJjbGUtby1sZWZ0JzogJ2YxOTAnLCAndG9nZ2xlLWxlZnQsY2FyZXQtc3F1YXJlLW8tbGVmdCc6ICdmMTkxJywgJ2RvdC1jaXJjbGUtbyc6ICdmMTkyJywgJ3doZWVsY2hhaXInOiAnZjE5MycsICd2aW1lby1zcXVhcmUnOiAnZjE5NCcsICd0dXJraXNoLWxpcmEsdHJ5JzogJ2YxOTUnLCAncGx1cy1zcXVhcmUtbyc6ICdmMTk2JywgJ3NwYWNlLXNodXR0bGUnOiAnZjE5NycsICdzbGFjayc6ICdmMTk4JywgJ2VudmVsb3BlLXNxdWFyZSc6ICdmMTk5JywgJ3dvcmRwcmVzcyc6ICdmMTlhJywgJ29wZW5pZCc6ICdmMTliJywgJ2luc3RpdHV0aW9uLGJhbmssdW5pdmVyc2l0eSc6ICdmMTljJywgJ21vcnRhci1ib2FyZCxncmFkdWF0aW9uLWNhcCc6ICdmMTlkJywgJ3lhaG9vJzogJ2YxOWUnLCAnZ29vZ2xlJzogJ2YxYTAnLCAncmVkZGl0JzogJ2YxYTEnLCAncmVkZGl0LXNxdWFyZSc6ICdmMWEyJywgJ3N0dW1ibGV1cG9uLWNpcmNsZSc6ICdmMWEzJywgJ3N0dW1ibGV1cG9uJzogJ2YxYTQnLCAnZGVsaWNpb3VzJzogJ2YxYTUnLCAnZGlnZyc6ICdmMWE2JywgJ3BpZWQtcGlwZXItcHAnOiAnZjFhNycsICdwaWVkLXBpcGVyLWFsdCc6ICdmMWE4JywgJ2RydXBhbCc6ICdmMWE5JywgJ2pvb21sYSc6ICdmMWFhJywgJ2xhbmd1YWdlJzogJ2YxYWInLCAnZmF4JzogJ2YxYWMnLCAnYnVpbGRpbmcnOiAnZjFhZCcsICdjaGlsZCc6ICdmMWFlJywgJ3Bhdyc6ICdmMWIwJywgJ3Nwb29uJzogJ2YxYjEnLCAnY3ViZSc6ICdmMWIyJywgJ2N1YmVzJzogJ2YxYjMnLCAnYmVoYW5jZSc6ICdmMWI0JywgJ2JlaGFuY2Utc3F1YXJlJzogJ2YxYjUnLCAnc3RlYW0nOiAnZjFiNicsICdzdGVhbS1zcXVhcmUnOiAnZjFiNycsICdyZWN5Y2xlJzogJ2YxYjgnLCAnYXV0b21vYmlsZSxjYXInOiAnZjFiOScsICdjYWIsdGF4aSc6ICdmMWJhJywgJ3RyZWUnOiAnZjFiYicsICdzcG90aWZ5JzogJ2YxYmMnLCAnZGV2aWFudGFydCc6ICdmMWJkJywgJ3NvdW5kY2xvdWQnOiAnZjFiZScsICdkYXRhYmFzZSc6ICdmMWMwJywgJ2ZpbGUtcGRmLW8nOiAnZjFjMScsICdmaWxlLXdvcmQtbyc6ICdmMWMyJywgJ2ZpbGUtZXhjZWwtbyc6ICdmMWMzJywgJ2ZpbGUtcG93ZXJwb2ludC1vJzogJ2YxYzQnLCAnZmlsZS1waG90by1vLGZpbGUtcGljdHVyZS1vLGZpbGUtaW1hZ2Utbyc6ICdmMWM1JywgJ2ZpbGUtemlwLW8sZmlsZS1hcmNoaXZlLW8nOiAnZjFjNicsICdmaWxlLXNvdW5kLW8sZmlsZS1hdWRpby1vJzogJ2YxYzcnLCAnZmlsZS1tb3ZpZS1vLGZpbGUtdmlkZW8tbyc6ICdmMWM4JywgJ2ZpbGUtY29kZS1vJzogJ2YxYzknLCAndmluZSc6ICdmMWNhJywgJ2NvZGVwZW4nOiAnZjFjYicsICdqc2ZpZGRsZSc6ICdmMWNjJywgJ2xpZmUtYm91eSxsaWZlLWJ1b3ksbGlmZS1zYXZlcixzdXBwb3J0LGxpZmUtcmluZyc6ICdmMWNkJywgJ2NpcmNsZS1vLW5vdGNoJzogJ2YxY2UnLCAncmEscmVzaXN0YW5jZSxyZWJlbCc6ICdmMWQwJywgJ2dlLGVtcGlyZSc6ICdmMWQxJywgJ2dpdC1zcXVhcmUnOiAnZjFkMicsICdnaXQnOiAnZjFkMycsICd5LWNvbWJpbmF0b3Itc3F1YXJlLHljLXNxdWFyZSxoYWNrZXItbmV3cyc6ICdmMWQ0JywgJ3RlbmNlbnQtd2VpYm8nOiAnZjFkNScsICdxcSc6ICdmMWQ2JywgJ3dlY2hhdCx3ZWl4aW4nOiAnZjFkNycsICdzZW5kLHBhcGVyLXBsYW5lJzogJ2YxZDgnLCAnc2VuZC1vLHBhcGVyLXBsYW5lLW8nOiAnZjFkOScsICdoaXN0b3J5JzogJ2YxZGEnLCAnY2lyY2xlLXRoaW4nOiAnZjFkYicsICdoZWFkZXInOiAnZjFkYycsICdwYXJhZ3JhcGgnOiAnZjFkZCcsICdzbGlkZXJzJzogJ2YxZGUnLCAnc2hhcmUtYWx0JzogJ2YxZTAnLCAnc2hhcmUtYWx0LXNxdWFyZSc6ICdmMWUxJywgJ2JvbWInOiAnZjFlMicsICdzb2NjZXItYmFsbC1vLGZ1dGJvbC1vJzogJ2YxZTMnLCAndHR5JzogJ2YxZTQnLCAnYmlub2N1bGFycyc6ICdmMWU1JywgJ3BsdWcnOiAnZjFlNicsICdzbGlkZXNoYXJlJzogJ2YxZTcnLCAndHdpdGNoJzogJ2YxZTgnLCAneWVscCc6ICdmMWU5JywgJ25ld3NwYXBlci1vJzogJ2YxZWEnLCAnd2lmaSc6ICdmMWViJywgJ2NhbGN1bGF0b3InOiAnZjFlYycsICdwYXlwYWwnOiAnZjFlZCcsICdnb29nbGUtd2FsbGV0JzogJ2YxZWUnLCAnY2MtdmlzYSc6ICdmMWYwJywgJ2NjLW1hc3RlcmNhcmQnOiAnZjFmMScsICdjYy1kaXNjb3Zlcic6ICdmMWYyJywgJ2NjLWFtZXgnOiAnZjFmMycsICdjYy1wYXlwYWwnOiAnZjFmNCcsICdjYy1zdHJpcGUnOiAnZjFmNScsICdiZWxsLXNsYXNoJzogJ2YxZjYnLCAnYmVsbC1zbGFzaC1vJzogJ2YxZjcnLCAndHJhc2gnOiAnZjFmOCcsICdjb3B5cmlnaHQnOiAnZjFmOScsICdhdCc6ICdmMWZhJywgJ2V5ZWRyb3BwZXInOiAnZjFmYicsICdwYWludC1icnVzaCc6ICdmMWZjJywgJ2JpcnRoZGF5LWNha2UnOiAnZjFmZCcsICdhcmVhLWNoYXJ0JzogJ2YxZmUnLCAncGllLWNoYXJ0JzogJ2YyMDAnLCAnbGluZS1jaGFydCc6ICdmMjAxJywgJ2xhc3RmbSc6ICdmMjAyJywgJ2xhc3RmbS1zcXVhcmUnOiAnZjIwMycsICd0b2dnbGUtb2ZmJzogJ2YyMDQnLCAndG9nZ2xlLW9uJzogJ2YyMDUnLCAnYmljeWNsZSc6ICdmMjA2JywgJ2J1cyc6ICdmMjA3JywgJ2lveGhvc3QnOiAnZjIwOCcsICdhbmdlbGxpc3QnOiAnZjIwOScsICdjYyc6ICdmMjBhJywgJ3NoZWtlbCxzaGVxZWwsaWxzJzogJ2YyMGInLCAnbWVhbnBhdGgnOiAnZjIwYycsICdidXlzZWxsYWRzJzogJ2YyMGQnLCAnY29ubmVjdGRldmVsb3AnOiAnZjIwZScsICdkYXNoY3ViZSc6ICdmMjEwJywgJ2ZvcnVtYmVlJzogJ2YyMTEnLCAnbGVhbnB1Yic6ICdmMjEyJywgJ3NlbGxzeSc6ICdmMjEzJywgJ3NoaXJ0c2luYnVsayc6ICdmMjE0JywgJ3NpbXBseWJ1aWx0JzogJ2YyMTUnLCAnc2t5YXRsYXMnOiAnZjIxNicsICdjYXJ0LXBsdXMnOiAnZjIxNycsICdjYXJ0LWFycm93LWRvd24nOiAnZjIxOCcsICdkaWFtb25kJzogJ2YyMTknLCAnc2hpcCc6ICdmMjFhJywgJ3VzZXItc2VjcmV0JzogJ2YyMWInLCAnbW90b3JjeWNsZSc6ICdmMjFjJywgJ3N0cmVldC12aWV3JzogJ2YyMWQnLCAnaGVhcnRiZWF0JzogJ2YyMWUnLCAndmVudXMnOiAnZjIyMScsICdtYXJzJzogJ2YyMjInLCAnbWVyY3VyeSc6ICdmMjIzJywgJ2ludGVyc2V4LHRyYW5zZ2VuZGVyJzogJ2YyMjQnLCAndHJhbnNnZW5kZXItYWx0JzogJ2YyMjUnLCAndmVudXMtZG91YmxlJzogJ2YyMjYnLCAnbWFycy1kb3VibGUnOiAnZjIyNycsICd2ZW51cy1tYXJzJzogJ2YyMjgnLCAnbWFycy1zdHJva2UnOiAnZjIyOScsICdtYXJzLXN0cm9rZS12JzogJ2YyMmEnLCAnbWFycy1zdHJva2UtaCc6ICdmMjJiJywgJ25ldXRlcic6ICdmMjJjJywgJ2dlbmRlcmxlc3MnOiAnZjIyZCcsICdmYWNlYm9vay1vZmZpY2lhbCc6ICdmMjMwJywgJ3BpbnRlcmVzdC1wJzogJ2YyMzEnLCAnd2hhdHNhcHAnOiAnZjIzMicsICdzZXJ2ZXInOiAnZjIzMycsICd1c2VyLXBsdXMnOiAnZjIzNCcsICd1c2VyLXRpbWVzJzogJ2YyMzUnLCAnaG90ZWwsYmVkJzogJ2YyMzYnLCAndmlhY29pbic6ICdmMjM3JywgJ3RyYWluJzogJ2YyMzgnLCAnc3Vid2F5JzogJ2YyMzknLCAnbWVkaXVtJzogJ2YyM2EnLCAneWMseS1jb21iaW5hdG9yJzogJ2YyM2InLCAnb3B0aW4tbW9uc3Rlcic6ICdmMjNjJywgJ29wZW5jYXJ0JzogJ2YyM2QnLCAnZXhwZWRpdGVkc3NsJzogJ2YyM2UnLCAnYmF0dGVyeS00LGJhdHRlcnktZnVsbCc6ICdmMjQwJywgJ2JhdHRlcnktMyxiYXR0ZXJ5LXRocmVlLXF1YXJ0ZXJzJzogJ2YyNDEnLCAnYmF0dGVyeS0yLGJhdHRlcnktaGFsZic6ICdmMjQyJywgJ2JhdHRlcnktMSxiYXR0ZXJ5LXF1YXJ0ZXInOiAnZjI0MycsICdiYXR0ZXJ5LTAsYmF0dGVyeS1lbXB0eSc6ICdmMjQ0JywgJ21vdXNlLXBvaW50ZXInOiAnZjI0NScsICdpLWN1cnNvcic6ICdmMjQ2JywgJ29iamVjdC1ncm91cCc6ICdmMjQ3JywgJ29iamVjdC11bmdyb3VwJzogJ2YyNDgnLCAnc3RpY2t5LW5vdGUnOiAnZjI0OScsICdzdGlja3ktbm90ZS1vJzogJ2YyNGEnLCAnY2MtamNiJzogJ2YyNGInLCAnY2MtZGluZXJzLWNsdWInOiAnZjI0YycsICdjbG9uZSc6ICdmMjRkJywgJ2JhbGFuY2Utc2NhbGUnOiAnZjI0ZScsICdob3VyZ2xhc3Mtbyc6ICdmMjUwJywgJ2hvdXJnbGFzcy0xLGhvdXJnbGFzcy1zdGFydCc6ICdmMjUxJywgJ2hvdXJnbGFzcy0yLGhvdXJnbGFzcy1oYWxmJzogJ2YyNTInLCAnaG91cmdsYXNzLTMsaG91cmdsYXNzLWVuZCc6ICdmMjUzJywgJ2hvdXJnbGFzcyc6ICdmMjU0JywgJ2hhbmQtZ3JhYi1vLGhhbmQtcm9jay1vJzogJ2YyNTUnLCAnaGFuZC1zdG9wLW8saGFuZC1wYXBlci1vJzogJ2YyNTYnLCAnaGFuZC1zY2lzc29ycy1vJzogJ2YyNTcnLCAnaGFuZC1saXphcmQtbyc6ICdmMjU4JywgJ2hhbmQtc3BvY2stbyc6ICdmMjU5JywgJ2hhbmQtcG9pbnRlci1vJzogJ2YyNWEnLCAnaGFuZC1wZWFjZS1vJzogJ2YyNWInLCAndHJhZGVtYXJrJzogJ2YyNWMnLCAncmVnaXN0ZXJlZCc6ICdmMjVkJywgJ2NyZWF0aXZlLWNvbW1vbnMnOiAnZjI1ZScsICdnZyc6ICdmMjYwJywgJ2dnLWNpcmNsZSc6ICdmMjYxJywgJ3RyaXBhZHZpc29yJzogJ2YyNjInLCAnb2Rub2tsYXNzbmlraSc6ICdmMjYzJywgJ29kbm9rbGFzc25pa2ktc3F1YXJlJzogJ2YyNjQnLCAnZ2V0LXBvY2tldCc6ICdmMjY1JywgJ3dpa2lwZWRpYS13JzogJ2YyNjYnLCAnc2FmYXJpJzogJ2YyNjcnLCAnY2hyb21lJzogJ2YyNjgnLCAnZmlyZWZveCc6ICdmMjY5JywgJ29wZXJhJzogJ2YyNmEnLCAnaW50ZXJuZXQtZXhwbG9yZXInOiAnZjI2YicsICd0dix0ZWxldmlzaW9uJzogJ2YyNmMnLCAnY29udGFvJzogJ2YyNmQnLCAnNTAwcHgnOiAnZjI2ZScsICdhbWF6b24nOiAnZjI3MCcsICdjYWxlbmRhci1wbHVzLW8nOiAnZjI3MScsICdjYWxlbmRhci1taW51cy1vJzogJ2YyNzInLCAnY2FsZW5kYXItdGltZXMtbyc6ICdmMjczJywgJ2NhbGVuZGFyLWNoZWNrLW8nOiAnZjI3NCcsICdpbmR1c3RyeSc6ICdmMjc1JywgJ21hcC1waW4nOiAnZjI3NicsICdtYXAtc2lnbnMnOiAnZjI3NycsICdtYXAtbyc6ICdmMjc4JywgJ21hcCc6ICdmMjc5JywgJ2NvbW1lbnRpbmcnOiAnZjI3YScsICdjb21tZW50aW5nLW8nOiAnZjI3YicsICdob3V6eic6ICdmMjdjJywgJ3ZpbWVvJzogJ2YyN2QnLCAnYmxhY2stdGllJzogJ2YyN2UnLCAnZm9udGljb25zJzogJ2YyODAnLCAncmVkZGl0LWFsaWVuJzogJ2YyODEnLCAnZWRnZSc6ICdmMjgyJywgJ2NyZWRpdC1jYXJkLWFsdCc6ICdmMjgzJywgJ2NvZGllcGllJzogJ2YyODQnLCAnbW9keCc6ICdmMjg1JywgJ2ZvcnQtYXdlc29tZSc6ICdmMjg2JywgJ3VzYic6ICdmMjg3JywgJ3Byb2R1Y3QtaHVudCc6ICdmMjg4JywgJ21peGNsb3VkJzogJ2YyODknLCAnc2NyaWJkJzogJ2YyOGEnLCAncGF1c2UtY2lyY2xlJzogJ2YyOGInLCAncGF1c2UtY2lyY2xlLW8nOiAnZjI4YycsICdzdG9wLWNpcmNsZSc6ICdmMjhkJywgJ3N0b3AtY2lyY2xlLW8nOiAnZjI4ZScsICdzaG9wcGluZy1iYWcnOiAnZjI5MCcsICdzaG9wcGluZy1iYXNrZXQnOiAnZjI5MScsICdoYXNodGFnJzogJ2YyOTInLCAnYmx1ZXRvb3RoJzogJ2YyOTMnLCAnYmx1ZXRvb3RoLWInOiAnZjI5NCcsICdwZXJjZW50JzogJ2YyOTUnLCAnZ2l0bGFiJzogJ2YyOTYnLCAnd3BiZWdpbm5lcic6ICdmMjk3JywgJ3dwZm9ybXMnOiAnZjI5OCcsICdlbnZpcmEnOiAnZjI5OScsICd1bml2ZXJzYWwtYWNjZXNzJzogJ2YyOWEnLCAnd2hlZWxjaGFpci1hbHQnOiAnZjI5YicsICdxdWVzdGlvbi1jaXJjbGUtbyc6ICdmMjljJywgJ2JsaW5kJzogJ2YyOWQnLCAnYXVkaW8tZGVzY3JpcHRpb24nOiAnZjI5ZScsICd2b2x1bWUtY29udHJvbC1waG9uZSc6ICdmMmEwJywgJ2JyYWlsbGUnOiAnZjJhMScsICdhc3Npc3RpdmUtbGlzdGVuaW5nLXN5c3RlbXMnOiAnZjJhMicsICdhc2wtaW50ZXJwcmV0aW5nLGFtZXJpY2FuLXNpZ24tbGFuZ3VhZ2UtaW50ZXJwcmV0aW5nJzogJ2YyYTMnLCAnZGVhZm5lc3MsaGFyZC1vZi1oZWFyaW5nLGRlYWYnOiAnZjJhNCcsICdnbGlkZSc6ICdmMmE1JywgJ2dsaWRlLWcnOiAnZjJhNicsICdzaWduaW5nLHNpZ24tbGFuZ3VhZ2UnOiAnZjJhNycsICdsb3ctdmlzaW9uJzogJ2YyYTgnLCAndmlhZGVvJzogJ2YyYTknLCAndmlhZGVvLXNxdWFyZSc6ICdmMmFhJywgJ3NuYXBjaGF0JzogJ2YyYWInLCAnc25hcGNoYXQtZ2hvc3QnOiAnZjJhYycsICdzbmFwY2hhdC1zcXVhcmUnOiAnZjJhZCcsICdwaWVkLXBpcGVyJzogJ2YyYWUnLCAnZmlyc3Qtb3JkZXInOiAnZjJiMCcsICd5b2FzdCc6ICdmMmIxJywgJ3RoZW1laXNsZSc6ICdmMmIyJywgJ2dvb2dsZS1wbHVzLWNpcmNsZSxnb29nbGUtcGx1cy1vZmZpY2lhbCc6ICdmMmIzJywgJ2ZhLGZvbnQtYXdlc29tZSc6ICdmMmI0JyB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGljb24oZCkge1xyXG4gICAgICAgIHZhciBjb2RlO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5pY29uTWFwICYmIG9wdGlvbnMuc2hvd0ljb25zICYmIG9wdGlvbnMuaWNvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dICYmIG9wdGlvbnMuaWNvbk1hcFtvcHRpb25zLmljb25zW2QubGFiZWxzWzBdXV0pIHtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBvcHRpb25zLmljb25NYXBbb3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV1dO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaWNvbk1hcFtkLmxhYmVsc1swXV0pIHtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBvcHRpb25zLmljb25NYXBbZC5sYWJlbHNbMF1dO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dKSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlID0gb3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGltYWdlKGQpIHtcclxuICAgICAgICB2YXIgaSwgaW1hZ2VzRm9yTGFiZWwsIGltZywgaW1nTGV2ZWwsIGxhYmVsLCBsYWJlbFByb3BlcnR5VmFsdWUsIHByb3BlcnR5LCB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIGltYWdlc0ZvckxhYmVsID0gb3B0aW9ucy5pbWFnZU1hcFtkLmxhYmVsc1swXV07XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1hZ2VzRm9yTGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIGltZ0xldmVsID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW1hZ2VzRm9yTGFiZWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbFByb3BlcnR5VmFsdWUgPSBpbWFnZXNGb3JMYWJlbFtpXS5zcGxpdCgnfCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBsYWJlbFByb3BlcnR5VmFsdWVbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBsYWJlbFByb3BlcnR5VmFsdWVbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBsYWJlbFByb3BlcnR5VmFsdWVbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZC5sYWJlbHNbMF0gPT09IGxhYmVsICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICghcHJvcGVydHkgfHwgZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoIXZhbHVlIHx8IGQucHJvcGVydGllc1twcm9wZXJ0eV0gPT09IHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWxQcm9wZXJ0eVZhbHVlLmxlbmd0aCA+IGltZ0xldmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSBvcHRpb25zLmltYWdlc1tpbWFnZXNGb3JMYWJlbFtpXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdMZXZlbCA9IGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbWc7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdChfc2VsZWN0b3IsIF9vcHRpb25zKSB7XHJcbiAgICAgICAgaW5pdEljb25NYXAoKTtcclxuXHJcbiAgICAgICAgbWVyZ2Uob3B0aW9ucywgX29wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5pY29ucykge1xyXG4gICAgICAgICAgICBvcHRpb25zLnNob3dJY29ucyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIW9wdGlvbnMubWluQ29sbGlzaW9uKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMubWluQ29sbGlzaW9uID0gb3B0aW9ucy5ub2RlUmFkaXVzICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRJbWFnZU1hcCgpO1xyXG5cclxuICAgICAgICBzZWxlY3RvciA9IF9zZWxlY3RvcjtcclxuXHJcbiAgICAgICAgY29udGFpbmVyID0gZDMuc2VsZWN0KHNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMnKVxyXG4gICAgICAgICAgICAuaHRtbCgnJyk7XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zLmluZm9QYW5lbCkge1xyXG4gICAgICAgICAgICBpbmZvID0gYXBwZW5kSW5mb1BhbmVsKGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBlbmRHcmFwaChjb250YWluZXIpO1xyXG5cclxuICAgICAgICBzaW11bGF0aW9uID0gaW5pdFNpbXVsYXRpb24oKTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMubmVvNGpEYXRhKSB7XHJcbiAgICAgICAgICAgIGxvYWROZW80akRhdGEob3B0aW9ucy5uZW80akRhdGEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5uZW80akRhdGFVcmwpIHtcclxuICAgICAgICAgICAgbG9hZE5lbzRqRGF0YUZyb21Vcmwob3B0aW9ucy5uZW80akRhdGFVcmwpO1xyXG4gICAgICAgICAgICAvLyBsb2FkTmVvNGpEYXRhRnJvbVVybCgnanNvbi90ZW1wLmpzb24nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogYm90aCBuZW80akRhdGEgYW5kIG5lbzRqRGF0YVVybCBhcmUgZW1wdHkhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0SWNvbk1hcCgpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zLmljb25NYXApLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIGtleXMgPSBrZXkuc3BsaXQoJywnKSxcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gb3B0aW9ucy5pY29uTWFwW2tleV07XHJcblxyXG4gICAgICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5pY29uTWFwW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEltYWdlTWFwKCkge1xyXG4gICAgICAgIHZhciBrZXksIGtleXMsIHNlbGVjdG9yO1xyXG5cclxuICAgICAgICBmb3IgKGtleSBpbiBvcHRpb25zLmltYWdlcykge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pbWFnZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAga2V5cyA9IGtleS5zcGxpdCgnfCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaW1hZ2VNYXBba2V5c1swXV0gPSBba2V5XTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXS5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFNpbXVsYXRpb24oKSB7XHJcbiAgICAgICAgdmFyIHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIC52ZWxvY2l0eURlY2F5KDAuOClcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yY2UoJ3gnLCBkMy5mb3JjZSgpLnN0cmVuZ3RoKDAuMDAyKSlcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yY2UoJ3knLCBkMy5mb3JjZSgpLnN0cmVuZ3RoKDAuMDAyKSlcclxuICAgICAgICAgICAgLmZvcmNlKCdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKCkucmFkaXVzKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5taW5Db2xsaXNpb247XHJcbiAgICAgICAgICAgIH0pLml0ZXJhdGlvbnMoMikpXHJcbiAgICAgICAgICAgIC5mb3JjZSgnY2hhcmdlJywgZDMuZm9yY2VNYW55Qm9keSgpKVxyXG4gICAgICAgICAgICAuZm9yY2UoJ2xpbmsnLCBkMy5mb3JjZUxpbmsoKS5pZChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGQuaWQ7XHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAuZm9yY2UoJ2NlbnRlcicsIGQzLmZvcmNlQ2VudGVyKHN2Zy5ub2RlKCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMiwgc3ZnLm5vZGUoKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMikpXHJcbiAgICAgICAgICAgIC5vbigndGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRpY2soKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy56b29tRml0ICYmICFqdXN0TG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAganVzdExvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgem9vbUZpdCgyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaW11bGF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWROZW80akRhdGEoKSB7XHJcbiAgICAgICAgbm9kZXMgPSBbXTtcclxuICAgICAgICByZWxhdGlvbnNoaXBzID0gW107XHJcblxyXG4gICAgICAgIHVwZGF0ZVdpdGhOZW80akRhdGEob3B0aW9ucy5uZW80akRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWROZW80akRhdGFGcm9tVXJsKG5lbzRqRGF0YVVybCkge1xyXG4gICAgICAgIG5vZGVzID0gW107XHJcbiAgICAgICAgcmVsYXRpb25zaGlwcyA9IFtdO1xyXG5cclxuICAgICAgICBkMy5qc29uKG5lbzRqRGF0YVVybCwgZnVuY3Rpb24gKGVycm9yLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZVdpdGhOZW80akRhdGEoZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0gPSBzb3VyY2VbcHJvcGVydHldO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5lbzRqRGF0YVRvRDNEYXRhKGRhdGEpIHtcclxuICAgICAgICB2YXIgZ3JhcGggPSB7XHJcbiAgICAgICAgICAgIG5vZGVzOiBbXSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwczogW11cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBkYXRhLnJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5kYXRhLmZvckVhY2goZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuZ3JhcGgubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY29udGFpbnMoZ3JhcGgubm9kZXMsIG5vZGUuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoLm5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzLmZvckVhY2goZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC5zb3VyY2UgPSByZWxhdGlvbnNoaXAuc3RhcnROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC50YXJnZXQgPSByZWxhdGlvbnNoaXAuZW5kTm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaC5yZWxhdGlvbnNoaXBzLnB1c2gocmVsYXRpb25zaGlwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEuc291cmNlID4gYi5zb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhLnNvdXJjZSA8IGIuc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYS50YXJnZXQgPiBiLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhLnRhcmdldCA8IGIudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT09IDAgJiYgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLnNvdXJjZSA9PT0gZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2kgLSAxXS5zb3VyY2UgJiYgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLnRhcmdldCA9PT0gZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2kgLSAxXS50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzW2ldLmxpbmtudW0gPSBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHNbaSAtIDFdLmxpbmtudW0gKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwc1tpXS5saW5rbnVtID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZ3JhcGg7XHJcbiAgICB9XHJcbiAgICB2YXIgbXAgPSBuZXcgQXJyYXkoKTtcclxuICAgIHZhciByZWwgPSBuZXcgQXJyYXkoKTtcclxuICAgIGZ1bmN0aW9uIHJhbmRvbUQzRGF0YShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgbm9kZXM6IFtdLFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzOiBbXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgIGosXHJcbiAgICAgICAgICAgIGxhYmVsLFxyXG4gICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICBuZXh0X25vZGVfcmVsLFxyXG4gICAgICAgICAgICBuZXh0X25vZGVfZGljdCxcclxuICAgICAgICAgICAgbmV4dF9ub2RlLFxyXG4gICAgICAgICAgICBuZXh0X3JlbCxcclxuICAgICAgICAgICAgbnVtTm9kZXMgPSAobWF4Tm9kZXNUb0dlbmVyYXRlICogTWF0aC5yYW5kb20oKSA8PCAwKSArIDEsXHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcclxuICAgICAgICAgICAgcyA9IHNpemUoKTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG51bU5vZGVzOyBpKyspIHtcclxuICAgICAgICAgICAgbGFiZWwgPSByYW5kb21MYWJlbCgpO1xyXG4gICAgICAgICAgICBuZXh0X25vZGVfZGljdCA9IGZpbmRUaGVOZXh0Tm9kZShkLG1heE5vZGVzVG9HZW5lcmF0ZSk7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IG5leHRfbm9kZV9kaWN0LnJlbC5sZW5ndGggOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgLy8gIG5leHRfbm9kZV9yZWwgPSBuZXh0X25vZGVfZGljdC5ub2RlW2pdO1xyXG4gICAgICAgICAgICAgICAgbmV4dF9ub2RlID0gbmV4dF9ub2RlX2RpY3Qubm9kZVtqXTtcclxuICAgICAgICAgICAgICAgIG5leHRfcmVsID0gbmV4dF9ub2RlX2RpY3QucmVsW2pdO1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogbmV4dF9ub2RlW1wiaWRcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzOiBuZXh0X25vZGVbXCJsYWJlbHNcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogbmV4dF9ub2RlW1wicHJvcGVydGllc1wiXSxcclxuICAgICAgICAgICAgICAgICAgICB4OiBkLngsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogZC55XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLy9hbGVydChuZXh0X25vZGUucHJvcGVydGllcy51c2VkKTtcclxuICAgICAgICAgICAgICAgIGlmKG5leHRfbm9kZS5wcm9wZXJ0aWVzLnVzZWQgIT09ICd0cnVlJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5ub2Rlc1tkYXRhLm5vZGVzLmxlbmd0aF0gPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICBcclxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogbmV4dF9yZWxbXCJpZFwiXSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBuZXh0X3JlbFtcInR5cGVcIl0udG9VcHBlckNhc2UoKSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydE5vZGU6IGQuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5kTm9kZTogbmV4dF9ub2RlW1wiaWRcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogbmV4dF9yZWxbXCJwcm9wZXJ0aWVzXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZC5pZCxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IG5leHRfbm9kZVtcImlkXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmtudW06IHMucmVsYXRpb25zaGlwcyArIDEgKyBpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaWYobmV4dF9yZWwucHJvcGVydGllcy51c2VkICE9PSAndHJ1ZScpe1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucmVsYXRpb25zaGlwc1tkYXRhLnJlbGF0aW9uc2hpcHMubGVuZ3RoXSA9IHJlbGF0aW9uc2hpcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbmRUaGVOZXh0Tm9kZShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgbm9kZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6IFtcIlVzZXJcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VySWRcIjogXCJlaXNtYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VkXCI6IFwidHJ1ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6IFtcIlByb2plY3RcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibmVvNGpkM1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwibmVvNGpkMy5qc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiTmVvNGogZ3JhcGggdmlzdWFsaXphdGlvbiB1c2luZyBEMy5qcy5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJodHRwczovL2Vpc21hbi5naXRodWIuaW8vbmVvNGpkM1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzZWRcIjogXCJmYWxzZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiOVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxzXCI6IFtcIlVzZWZmZnJcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VySWRcIjogXCJlaXNtYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VkXCI6IFwiZmFsc2VcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjJcIixcclxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOiBbXCJVc2VyXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydGllc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNlcklkXCI6IFwiZWlzbWFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNlZFwiOiBcInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIlBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOiBbXCJVc2VmZnJcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VySWRcIjogXCJlaXNtYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VkXCI6IFwiZmFsc2VcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIlFcIixcclxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOiBbXCJVc2VmZnJcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VySWRcIjogXCJlaXNtYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VkXCI6IFwiZmFsc2VcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI3XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiREVWRUxPUEVTXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdGFydE5vZGVcIjogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmROb2RlXCI6IFwiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydGllc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiAxNDcwMDAyNDAwMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzZWRcIjogJ2ZhbHNlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzb3VyY2VcIjogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjogXCI4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rbnVtXCI6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjhcIixcclxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJERVZFTE9QRVNcIixcclxuICAgICAgICAgICAgICAgICAgICBcInN0YXJ0Tm9kZVwiOiBcIjhcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZE5vZGVcIjogXCI5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IDE0NzAwMDI0MDAwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNlZFwiOiAnZmFsc2UnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcInNvdXJjZVwiOiBcIjhcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiBcIjlcIixcclxuICAgICAgICAgICAgICAgICAgICBcImxpbmtudW1cIjogMlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiOVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkRFVkVMT1BFU1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3RhcnROb2RlXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kTm9kZVwiOiBcIlBcIixcclxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnRpZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogMTQ3MDAwMjQwMDAwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VkXCI6ICdmYWxzZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IFwiUFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGlua251bVwiOiAzXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIxMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkRFVkVMT1BFU1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3RhcnROb2RlXCI6IFwiMlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kTm9kZVwiOiBcIjhcIixcclxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnRpZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogMTQ3MDAwMjQwMDAwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VkXCI6ICdmYWxzZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlXCI6IFwiMlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IFwiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGlua251bVwiOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCIxMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkRFVkVMT1BFU1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3RhcnROb2RlXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kTm9kZVwiOiBcIlFcIixcclxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnRpZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogMTQ3MDAwMjQwMDAwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VkXCI6ICdmYWxzZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IFwiUVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGlua251bVwiOiAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LGksaixrID0gMCxcclxuICAgICAgICBkaWN0bmV4dG5vZGUgPXtcclxuICAgICAgICAgICAgbm9kZTpbXSxcclxuICAgICAgICAgICAgcmVsOltdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5yZWxhdGlvbnNoaXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnJlbGF0aW9uc2hpcHNbaV0uc3RhcnROb2RlID09PSBkLmlkKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGFsZXJ0KGkpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGRhdGEubm9kZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5ub2Rlc1tqXS5pZCA9PT0gZGF0YS5yZWxhdGlvbnNoaXBzW2ldLmVuZE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG1wW2RhdGEubm9kZXNbal0uaWRdID09PSAxKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoZGF0YS5ub2Rlc1tqXS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm5vZGVzW2pdLnByb3BlcnRpZXMudXNlZCA9ICd0cnVlJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXBbZGF0YS5ub2Rlc1tqXS5pZF0gPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlbFtkYXRhLnJlbGF0aW9uc2hpcHNbaV0uaWRdID09PSAxKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KGRhdGEubm9kZXNbal0uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucmVsYXRpb25zaGlwc1tpXS5wcm9wZXJ0aWVzLnVzZWQgPSAndHJ1ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbFtkYXRhLnJlbGF0aW9uc2hpcHNbaV0uaWRdID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGljdG5leHRub2RlLm5vZGVbZGljdG5leHRub2RlLm5vZGUubGVuZ3RoXSA9IGRhdGEubm9kZXNbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpY3RuZXh0bm9kZS5yZWxbZGljdG5leHRub2RlLnJlbC5sZW5ndGhdID0gZGF0YS5yZWxhdGlvbnNoaXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoayA9PT0gbWF4Tm9kZXNUb0dlbmVyYXRlKSB7YnJlYWs7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KGRhdGEubm9kZXNbal0ucHJvcGVydGllcy51c2VkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgZGF0YS5ub2Rlc1tqXS5wcm9wZXJ0aWVzLnVzZWQgPSAndHJ1ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gIGFsZXJ0KGRhdGEubm9kZXNbal0ucHJvcGVydGllcy51c2VkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkaWN0bmV4dG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4ge25vZGU6ZGF0YS5ub2Rlc1tqXSwgcmVsOmRhdGEucmVsYXRpb25zaGlwc1tpXX07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGsgPT09IG1heE5vZGVzVG9HZW5lcmF0ZSkge2JyZWFrO31cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coZGljdG5leHRub2RlKTtcclxuICAgICAgICByZXR1cm4gZGljdG5leHRub2RlO1xyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByYW5kb21MYWJlbCgpIHtcclxuICAgICAgICB2YXIgaWNvbnMgPSBPYmplY3Qua2V5cyhvcHRpb25zLmljb25NYXApO1xyXG4gICAgICAgIHJldHVybiBpY29uc1tpY29ucy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpIDw8IDBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGF0ZShjeCwgY3ksIHgsIHksIGFuZ2xlKSB7XHJcbiAgICAgICAgdmFyIHJhZGlhbnMgPSAoTWF0aC5QSSAvIDE4MCkgKiBhbmdsZSxcclxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MocmFkaWFucyksXHJcbiAgICAgICAgICAgIHNpbiA9IE1hdGguc2luKHJhZGlhbnMpLFxyXG4gICAgICAgICAgICBueCA9IChjb3MgKiAoeCAtIGN4KSkgKyAoc2luICogKHkgLSBjeSkpICsgY3gsXHJcbiAgICAgICAgICAgIG55ID0gKGNvcyAqICh5IC0gY3kpKSAtIChzaW4gKiAoeCAtIGN4KSkgKyBjeTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgeDogbngsIHk6IG55IH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlUG9pbnQoYywgcCwgYW5nbGUpIHtcclxuICAgICAgICByZXR1cm4gcm90YXRlKGMueCwgYy55LCBwLngsIHAueSwgYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGF0aW9uKHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGFyZ2V0LnkgLSBzb3VyY2UueSwgdGFyZ2V0LnggLSBzb3VyY2UueCkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbm9kZXM6IG5vZGVzLmxlbmd0aCxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwczogcmVsYXRpb25zaGlwcy5sZW5ndGhcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgLypcclxuICAgICAgICBmdW5jdGlvbiBzbW9vdGhUcmFuc2Zvcm0oZWxlbSwgdHJhbnNsYXRlLCBzY2FsZSkge1xyXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uTWlsbGlzZWNvbmRzID0gNTAwMCxcclxuICAgICAgICAgICAgICAgIHRpbWVvdXRNaWxsaXNlY29uZHMgPSA1MCxcclxuICAgICAgICAgICAgICAgIHN0ZXBzID0gcGFyc2VJbnQoYW5pbWF0aW9uTWlsbGlzZWNvbmRzIC8gdGltZW91dE1pbGxpc2Vjb25kcyk7XHJcbiAgICBcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNtb290aFRyYW5zZm9ybVN0ZXAoZWxlbSwgdHJhbnNsYXRlLCBzY2FsZSwgdGltZW91dE1pbGxpc2Vjb25kcywgMSwgc3RlcHMpO1xyXG4gICAgICAgICAgICB9LCB0aW1lb3V0TWlsbGlzZWNvbmRzKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBmdW5jdGlvbiBzbW9vdGhUcmFuc2Zvcm1TdGVwKGVsZW0sIHRyYW5zbGF0ZSwgc2NhbGUsIHRpbWVvdXRNaWxsaXNlY29uZHMsIHN0ZXAsIHN0ZXBzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IHN0ZXAgLyBzdGVwcztcclxuICAgIFxyXG4gICAgICAgICAgICBlbGVtLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICh0cmFuc2xhdGVbMF0gKiBwcm9ncmVzcykgKyAnLCAnICsgKHRyYW5zbGF0ZVsxXSAqIHByb2dyZXNzKSArICcpIHNjYWxlKCcgKyAoc2NhbGUgKiBwcm9ncmVzcykgKyAnKScpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGlmIChzdGVwIDwgc3RlcHMpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc21vb3RoVHJhbnNmb3JtU3RlcChlbGVtLCB0cmFuc2xhdGUsIHNjYWxlLCB0aW1lb3V0TWlsbGlzZWNvbmRzLCBzdGVwICsgMSwgc3RlcHMpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGltZW91dE1pbGxpc2Vjb25kcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gc3RpY2tOb2RlKGQpIHtcclxuICAgICAgICBkLmZ4ID0gZDMuZXZlbnQueDtcclxuICAgICAgICBkLmZ5ID0gZDMuZXZlbnQueTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0aWNrKCkge1xyXG4gICAgICAgIHRpY2tOb2RlcygpO1xyXG4gICAgICAgIHRpY2tSZWxhdGlvbnNoaXBzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGlja05vZGVzKCkge1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIG5vZGUuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCAnICsgZC55ICsgJyknO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGlja1JlbGF0aW9uc2hpcHMoKSB7XHJcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCkge1xyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhbmdsZSA9IHJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC5zb3VyY2UueCArICcsICcgKyBkLnNvdXJjZS55ICsgJykgcm90YXRlKCcgKyBhbmdsZSArICcpJztcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aWNrUmVsYXRpb25zaGlwc1RleHRzKCk7XHJcbiAgICAgICAgICAgIHRpY2tSZWxhdGlvbnNoaXBzT3V0bGluZXMoKTtcclxuICAgICAgICAgICAgdGlja1JlbGF0aW9uc2hpcHNPdmVybGF5cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0aWNrUmVsYXRpb25zaGlwc091dGxpbmVzKCkge1xyXG4gICAgICAgIHJlbGF0aW9uc2hpcC5lYWNoKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcclxuICAgICAgICAgICAgdmFyIHJlbCA9IGQzLnNlbGVjdCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIG91dGxpbmUgPSByZWwuc2VsZWN0KCcub3V0bGluZScpLFxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHJlbC5zZWxlY3QoJy50ZXh0JyksXHJcbiAgICAgICAgICAgICAgICBiYm94ID0gdGV4dC5ub2RlKCkuZ2V0QkJveCgpLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZyA9IDM7XHJcblxyXG4gICAgICAgICAgICBvdXRsaW5lLmF0dHIoJ2QnLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlID0gcm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0Qm91bmRpbmdCb3ggPSB0ZXh0Lm5vZGUoKS5nZXRCQm94KCksXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFBhZGRpbmcgPSA1LFxyXG4gICAgICAgICAgICAgICAgICAgIHUgPSB1bml0YXJ5VmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dE1hcmdpbiA9IHsgeDogKGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKHRleHRCb3VuZGluZ0JveC53aWR0aCArIHRleHRQYWRkaW5nKSAqIHUueCkgKiAwLjUsIHk6IChkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtICh0ZXh0Qm91bmRpbmdCb3gud2lkdGggKyB0ZXh0UGFkZGluZykgKiB1LnkpICogMC41IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IHVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcclxuICAgICAgICAgICAgICAgICAgICByb3RhdGVkUG9pbnRBMSA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwICsgKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gbi54LCB5OiAwICsgKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55IC0gbi55IH0sIGFuZ2xlKSxcclxuICAgICAgICAgICAgICAgICAgICByb3RhdGVkUG9pbnRCMSA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiB0ZXh0TWFyZ2luLnggLSBuLngsIHk6IHRleHRNYXJnaW4ueSAtIG4ueSB9LCBhbmdsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcm90YXRlZFBvaW50QzEgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogdGV4dE1hcmdpbi54LCB5OiB0ZXh0TWFyZ2luLnkgfSwgYW5nbGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0ZWRQb2ludEQxID0gcm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgKyAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LngsIHk6IDAgKyAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgfSwgYW5nbGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0ZWRQb2ludEEyID0gcm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gdGV4dE1hcmdpbi54IC0gbi54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIHRleHRNYXJnaW4ueSAtIG4ueSB9LCBhbmdsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcm90YXRlZFBvaW50QjIgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSBuLnggLSB1LnggKiBvcHRpb25zLmFycm93U2l6ZSwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSBuLnkgLSB1LnkgKiBvcHRpb25zLmFycm93U2l6ZSB9LCBhbmdsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcm90YXRlZFBvaW50QzIgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggLSBuLnggKyAobi54IC0gdS54KSAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIG4ueSArIChuLnkgLSB1LnkpICogb3B0aW9ucy5hcnJvd1NpemUgfSwgYW5nbGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0ZWRQb2ludEQyID0gcm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSB9LCBhbmdsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcm90YXRlZFBvaW50RTIgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnggKyAoLSBuLnggLSB1LngpICogb3B0aW9ucy5hcnJvd1NpemUsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS55ICsgKC0gbi55IC0gdS55KSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcclxuICAgICAgICAgICAgICAgICAgICByb3RhdGVkUG9pbnRGMiA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIHUueCAqIG9wdGlvbnMuYXJyb3dTaXplLCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIHUueSAqIG9wdGlvbnMuYXJyb3dTaXplIH0sIGFuZ2xlKSxcclxuICAgICAgICAgICAgICAgICAgICByb3RhdGVkUG9pbnRHMiA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIHRleHRNYXJnaW4ueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSB0ZXh0TWFyZ2luLnkgfSwgYW5nbGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAnTSAnICsgcm90YXRlZFBvaW50QTEueCArICcgJyArIHJvdGF0ZWRQb2ludEExLnkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QjEueCArICcgJyArIHJvdGF0ZWRQb2ludEIxLnkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QzEueCArICcgJyArIHJvdGF0ZWRQb2ludEMxLnkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RDEueCArICcgJyArIHJvdGF0ZWRQb2ludEQxLnkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgWiBNICcgKyByb3RhdGVkUG9pbnRBMi54ICsgJyAnICsgcm90YXRlZFBvaW50QTIueSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCMi54ICsgJyAnICsgcm90YXRlZFBvaW50QjIueSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRDMi54ICsgJyAnICsgcm90YXRlZFBvaW50QzIueSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnREMi54ICsgJyAnICsgcm90YXRlZFBvaW50RDIueSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRFMi54ICsgJyAnICsgcm90YXRlZFBvaW50RTIueSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRGMi54ICsgJyAnICsgcm90YXRlZFBvaW50RjIueSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRHMi54ICsgJyAnICsgcm90YXRlZFBvaW50RzIueSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyBaJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGlja1JlbGF0aW9uc2hpcHNPdmVybGF5cygpIHtcclxuICAgICAgICByZWxhdGlvbnNoaXBPdmVybGF5LmF0dHIoJ2QnLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXHJcbiAgICAgICAgICAgICAgICBhbmdsZSA9IHJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCksXHJcbiAgICAgICAgICAgICAgICBuMSA9IHVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcclxuICAgICAgICAgICAgICAgIG4gPSB1bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCwgNTApLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlZFBvaW50QSA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwIC0gbi54LCB5OiAwIC0gbi55IH0sIGFuZ2xlKSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZWRQb2ludEIgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSBuLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gbi55IH0sIGFuZ2xlKSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZWRQb2ludEMgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggKyBuLnggLSBuMS54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSArIG4ueSAtIG4xLnkgfSwgYW5nbGUpLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlZFBvaW50RCA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwICsgbi54IC0gbjEueCwgeTogMCArIG4ueSAtIG4xLnkgfSwgYW5nbGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICdNICcgKyByb3RhdGVkUG9pbnRBLnggKyAnICcgKyByb3RhdGVkUG9pbnRBLnkgK1xyXG4gICAgICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCLnggKyAnICcgKyByb3RhdGVkUG9pbnRCLnkgK1xyXG4gICAgICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRDLnggKyAnICcgKyByb3RhdGVkUG9pbnRDLnkgK1xyXG4gICAgICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRELnggKyAnICcgKyByb3RhdGVkUG9pbnRELnkgK1xyXG4gICAgICAgICAgICAgICAgJyBaJztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0aWNrUmVsYXRpb25zaGlwc1RleHRzKCkge1xyXG4gICAgICAgIHJlbGF0aW9uc2hpcFRleHQuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgdmFyIGFuZ2xlID0gKHJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCkgKyAzNjApICUgMzYwLFxyXG4gICAgICAgICAgICAgICAgbWlycm9yID0gYW5nbGUgPiA5MCAmJiBhbmdsZSA8IDI3MCxcclxuICAgICAgICAgICAgICAgIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxyXG4gICAgICAgICAgICAgICAgbiA9IHVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcclxuICAgICAgICAgICAgICAgIG5XZWlnaHQgPSBtaXJyb3IgPyAyIDogLTMsXHJcbiAgICAgICAgICAgICAgICBwb2ludCA9IHsgeDogKGQudGFyZ2V0LnggLSBkLnNvdXJjZS54KSAqIDAuNSArIG4ueCAqIG5XZWlnaHQsIHk6IChkLnRhcmdldC55IC0gZC5zb3VyY2UueSkgKiAwLjUgKyBuLnkgKiBuV2VpZ2h0IH0sXHJcbiAgICAgICAgICAgICAgICByb3RhdGVkUG9pbnQgPSByb3RhdGVQb2ludChjZW50ZXIsIHBvaW50LCBhbmdsZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgcm90YXRlZFBvaW50LnggKyAnLCAnICsgcm90YXRlZFBvaW50LnkgKyAnKSByb3RhdGUoJyArIChtaXJyb3IgPyAxODAgOiAwKSArICcpJztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b1N0cmluZyhkKSB7XHJcbiAgICAgICAgdmFyIHMgPSBkLmxhYmVscyA/IGQubGFiZWxzWzBdIDogZC50eXBlO1xyXG5cclxuICAgICAgICBzICs9ICcgKDxpZD46ICcgKyBkLmlkO1xyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhkLnByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHMgKz0gJywgJyArIHByb3BlcnR5ICsgJzogJyArIEpTT04uc3RyaW5naWZ5KGQucHJvcGVydGllc1twcm9wZXJ0eV0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzICs9ICcpJztcclxuXHJcbiAgICAgICAgcmV0dXJuIHM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdW5pdGFyeU5vcm1hbFZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxyXG4gICAgICAgICAgICB2ZWN0b3IgPSB1bml0YXJ5VmVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBuZXdMZW5ndGgpO1xyXG5cclxuICAgICAgICByZXR1cm4gcm90YXRlUG9pbnQoY2VudGVyLCB2ZWN0b3IsIDkwKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1bml0YXJ5VmVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBuZXdMZW5ndGgpIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KE1hdGgucG93KHRhcmdldC54IC0gc291cmNlLngsIDIpICsgTWF0aC5wb3codGFyZ2V0LnkgLSBzb3VyY2UueSwgMikpIC8gTWF0aC5zcXJ0KG5ld0xlbmd0aCB8fCAxKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogKHRhcmdldC54IC0gc291cmNlLngpIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICB5OiAodGFyZ2V0LnkgLSBzb3VyY2UueSkgLyBsZW5ndGgsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVXaXRoRDNEYXRhKGQzRGF0YSkge1xyXG5cclxuICAgICAgICB1cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMoZDNEYXRhLm5vZGVzLCBkM0RhdGEucmVsYXRpb25zaGlwcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlV2l0aE5lbzRqRGF0YShuZW80akRhdGEpIHtcclxuICAgICAgICB2YXIgZDNEYXRhID0gbmVvNGpEYXRhVG9EM0RhdGEobmVvNGpEYXRhKTtcclxuICAgICAgICB1cGRhdGVXaXRoRDNEYXRhKGQzRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlSW5mbyhkKSB7XHJcbiAgICAgICAgY2xlYXJJbmZvKCk7XHJcblxyXG4gICAgICAgIGlmIChkLmxhYmVscykge1xyXG4gICAgICAgICAgICBhcHBlbmRJbmZvRWxlbWVudENsYXNzKCdjbGFzcycsIGQubGFiZWxzWzBdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhcHBlbmRJbmZvRWxlbWVudFJlbGF0aW9uc2hpcCgnY2xhc3MnLCBkLnR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eSgncHJvcGVydHknLCAnJmx0O2lkJmd0OycsIGQuaWQpO1xyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhkLnByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIGFwcGVuZEluZm9FbGVtZW50UHJvcGVydHkoJ3Byb3BlcnR5JywgcHJvcGVydHksIEpTT04uc3RyaW5naWZ5KGQucHJvcGVydGllc1twcm9wZXJ0eV0pKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVOb2RlcyhuKSB7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkobm9kZXMsIG4pO1xyXG5cclxuICAgICAgICBub2RlID0gc3ZnTm9kZXMuc2VsZWN0QWxsKCcubm9kZScpXHJcbiAgICAgICAgICAgIC5kYXRhKG5vZGVzLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5pZDsgfSk7XHJcbiAgICAgICAgdmFyIG5vZGVFbnRlciA9IGFwcGVuZE5vZGVUb0dyYXBoKCk7XHJcbiAgICAgICAgbm9kZSA9IG5vZGVFbnRlci5tZXJnZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMobiwgcikge1xyXG4gICAgICAgIHVwZGF0ZVJlbGF0aW9uc2hpcHMocik7XHJcbiAgICAgICAgdXBkYXRlTm9kZXMobik7XHJcblxyXG4gICAgICAgIHNpbXVsYXRpb24ubm9kZXMobm9kZXMpO1xyXG4gICAgICAgIHNpbXVsYXRpb24uZm9yY2UoJ2xpbmsnKS5saW5rcyhyZWxhdGlvbnNoaXBzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVSZWxhdGlvbnNoaXBzKHIpIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZWxhdGlvbnNoaXBzLCByKTtcclxuXHJcbiAgICAgICAgcmVsYXRpb25zaGlwID0gc3ZnUmVsYXRpb25zaGlwcy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAnKVxyXG4gICAgICAgICAgICAuZGF0YShyZWxhdGlvbnNoaXBzLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5pZDsgfSk7XHJcblxyXG4gICAgICAgIHZhciByZWxhdGlvbnNoaXBFbnRlciA9IGFwcGVuZFJlbGF0aW9uc2hpcFRvR3JhcGgoKTtcclxuXHJcbiAgICAgICAgcmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRW50ZXIucmVsYXRpb25zaGlwLm1lcmdlKHJlbGF0aW9uc2hpcCk7XHJcblxyXG4gICAgICAgIHJlbGF0aW9uc2hpcE91dGxpbmUgPSBzdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC5vdXRsaW5lJyk7XHJcbiAgICAgICAgcmVsYXRpb25zaGlwT3V0bGluZSA9IHJlbGF0aW9uc2hpcEVudGVyLm91dGxpbmUubWVyZ2UocmVsYXRpb25zaGlwT3V0bGluZSk7XHJcblxyXG4gICAgICAgIHJlbGF0aW9uc2hpcE92ZXJsYXkgPSBzdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC5vdmVybGF5Jyk7XHJcbiAgICAgICAgcmVsYXRpb25zaGlwT3ZlcmxheSA9IHJlbGF0aW9uc2hpcEVudGVyLm92ZXJsYXkubWVyZ2UocmVsYXRpb25zaGlwT3ZlcmxheSk7XHJcblxyXG4gICAgICAgIHJlbGF0aW9uc2hpcFRleHQgPSBzdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC50ZXh0Jyk7XHJcbiAgICAgICAgcmVsYXRpb25zaGlwVGV4dCA9IHJlbGF0aW9uc2hpcEVudGVyLnRleHQubWVyZ2UocmVsYXRpb25zaGlwVGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmVyc2lvbigpIHtcclxuICAgICAgICByZXR1cm4gVkVSU0lPTjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB6b29tRml0KHRyYW5zaXRpb25EdXJhdGlvbikge1xyXG4gICAgICAgIHZhciBib3VuZHMgPSBzdmcubm9kZSgpLmdldEJCb3goKSxcclxuICAgICAgICAgICAgcGFyZW50ID0gc3ZnLm5vZGUoKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQsXHJcbiAgICAgICAgICAgIGZ1bGxXaWR0aCA9IHBhcmVudC5jbGllbnRXaWR0aCxcclxuICAgICAgICAgICAgZnVsbEhlaWdodCA9IHBhcmVudC5jbGllbnRIZWlnaHQsXHJcbiAgICAgICAgICAgIHdpZHRoID0gYm91bmRzLndpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQgPSBib3VuZHMuaGVpZ2h0LFxyXG4gICAgICAgICAgICBtaWRYID0gYm91bmRzLnggKyB3aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIG1pZFkgPSBib3VuZHMueSArIGhlaWdodCAvIDI7XHJcblxyXG4gICAgICAgIGlmICh3aWR0aCA9PT0gMCB8fCBoZWlnaHQgPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuOyAvLyBub3RoaW5nIHRvIGZpdFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3ZnU2NhbGUgPSAwLjg1IC8gTWF0aC5tYXgod2lkdGggLyBmdWxsV2lkdGgsIGhlaWdodCAvIGZ1bGxIZWlnaHQpO1xyXG4gICAgICAgIHN2Z1RyYW5zbGF0ZSA9IFtmdWxsV2lkdGggLyAyIC0gc3ZnU2NhbGUgKiBtaWRYLCBmdWxsSGVpZ2h0IC8gMiAtIHN2Z1NjYWxlICogbWlkWV07XHJcblxyXG4gICAgICAgIHN2Zy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBzdmdUcmFuc2xhdGVbMF0gKyAnLCAnICsgc3ZnVHJhbnNsYXRlWzFdICsgJykgc2NhbGUoJyArIHN2Z1NjYWxlICsgJyknKTtcclxuICAgICAgICAvLyAgICAgICAgc21vb3RoVHJhbnNmb3JtKHN2Z1RyYW5zbGF0ZSwgc3ZnU2NhbGUpO1xyXG4gICAgfVxyXG4gICAgLy/msqHnlKhcclxuICAgIGZ1bmN0aW9uIGxvYWROZW80akRhdGFGcm9tVXJsTmV3KCkge1xyXG4gICAgICAgIG5vZGVzID0gW107XHJcbiAgICAgICAgcmVsYXRpb25zaGlwcyA9IFtdO1xyXG4gICAgICAgIHZhciB0ID0gJ2pzb24vdGVtcC5qc29uJztcclxuICAgICAgICBkMy5qc29uKHQsIGZ1bmN0aW9uIChlcnJvciwgZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkM0RhdGEgPSBuZW80akRhdGFUb0QzRGF0YShkYXRhKTtcclxuICAgICAgICAgICAgdXBkYXRlV2l0aEQzRGF0YShkYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8v5pyJ55SoXHJcbiAgICBmdW5jdGlvbiBnZXRUZW1wTm9kZShkKSB7XHJcbiAgICAgICAgLy9sb2FkTmVvNGpEYXRhRnJvbVVybE5ldyh0ZW1wRGF0YVVybCk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIG5vZGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjFcIixcclxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsc1wiOiBbXCJVc2VyXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydGllc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNlcklkXCI6IFwiZWlzbWFuXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjogW1wiUHJvamVjdFwiXSxcclxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnRpZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJuZW80amQzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJuZW80amQzLmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJOZW80aiBncmFwaCB2aXN1YWxpemF0aW9uIHVzaW5nIEQzLmpzLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVybFwiOiBcImh0dHBzOi8vZWlzbWFuLmdpdGh1Yi5pby9uZW80amQzXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbHNcIjogW1wiVXNlZmZmclwiXSxcclxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnRpZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVzZXJJZFwiOiBcImVpc21hblwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIjdcIixcclxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJERVZFTE9QRVNcIixcclxuICAgICAgICAgICAgICAgICAgICBcInN0YXJ0Tm9kZVwiOiBcIjFcIixcclxuICAgICAgICAgICAgICAgICAgICBcImVuZE5vZGVcIjogXCI4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IDE0NzAwMDI0MDAwMDBcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IFwiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGlua251bVwiOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCI4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiREVWRUxPUEVTXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdGFydE5vZGVcIjogXCI4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbmROb2RlXCI6IFwiOVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydGllc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiAxNDcwMDAyNDAwMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcInNvdXJjZVwiOiBcIjhcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiBcIjlcIixcclxuICAgICAgICAgICAgICAgICAgICBcImxpbmtudW1cIjogMlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBub2RlcyA9IFtdO1xyXG4gICAgICAgIHJlbGF0aW9uc2hpcHMgPSBbXTtcclxuICAgICAgICB2YXIgdCA9ICdqc29uL3RlbXAuanNvbic7XHJcbiAgICAgICAgdmFyIHRlbXAgPSB7XHJcbiAgICAgICAgICAgIG5vZGVzOiBbXSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwczogW11cclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBpLFxyXG4gICAgICAgICAgICBqLFxyXG4gICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAsXHJcbiAgICAgICAgICAgIGluZGV4bm9kZSA9IDAsXHJcbiAgICAgICAgICAgIGluZGV4cmVsYXRpb25zaGlwID0gMDtcclxuXHJcbiAgICAgICAgdGVtcC5ub2Rlc1t0ZW1wLm5vZGVzLmxlbmd0aF0gPSBkO1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5yZWxhdGlvbnNoaXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnJlbGF0aW9uc2hpcHNbaV0uc3RhcnROb2RlID09PSBkLmlkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZGF0YS5ub2Rlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm5vZGVzW2pdLmlkID09PSBkYXRhLnJlbGF0aW9uc2hpcHNbaV0uZW5kTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gZGF0YS5ub2Rlc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwID0gZGF0YS5yZWxhdGlvbnNoaXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnggPSBkLng7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUueSA9IGQueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gIGFsZXJ0KG5vZGUueCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KDExMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KG5vZGUueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXAubm9kZXNbdGVtcC5ub2Rlcy5sZW5ndGhdID0gbm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcC5yZWxhdGlvbnNoaXBzW3RlbXAucmVsYXRpb25zaGlwcy5sZW5ndGhdID0gZGF0YS5yZWxhdGlvbnNoaXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleG5vZGUrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhyZWxhdGlvbnNoaXArKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQodGVtcC5ub2Rlcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChfc2VsZWN0b3IsIF9vcHRpb25zKTtcclxuICAgIC8v5paw5Yqg55qEZ2V0VGVtcE5vZGU6IGdldFRlbXBOb2Rl77yI55So5LqG77yJICAgbG9hZE5lbzRqRGF0YUZyb21VcmxOZXc6IGxvYWROZW80akRhdGFGcm9tVXJsTmV377yI5rKh55So77yJXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGFwcGVuZFJhbmRvbURhdGFUb05vZGU6IGFwcGVuZFJhbmRvbURhdGFUb05vZGUsXHJcbiAgICAgICAgbmVvNGpEYXRhVG9EM0RhdGE6IG5lbzRqRGF0YVRvRDNEYXRhLFxyXG4gICAgICAgIHJhbmRvbUQzRGF0YTogcmFuZG9tRDNEYXRhLFxyXG4gICAgICAgIHNpemU6IHNpemUsXHJcbiAgICAgICAgdXBkYXRlV2l0aEQzRGF0YTogdXBkYXRlV2l0aEQzRGF0YSxcclxuICAgICAgICB1cGRhdGVXaXRoTmVvNGpEYXRhOiB1cGRhdGVXaXRoTmVvNGpEYXRhLFxyXG4gICAgICAgIHZlcnNpb246IHZlcnNpb24sXHJcbiAgICAgICAgZ2V0VGVtcE5vZGU6IGdldFRlbXBOb2RlLFxyXG4gICAgICAgIGxvYWROZW80akRhdGFGcm9tVXJsTmV3OiBsb2FkTmVvNGpEYXRhRnJvbVVybE5ld1xyXG4gICAgfTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZW80akQzO1xyXG4iXX0=
