document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // HERO SECTION
    // ==========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
    });

    document.querySelectorAll('.search-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.search-tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Hero Search Bar Logic
    const heroSearchInput = document.getElementById('hero-search-input');
    const heroSearchBtn = document.querySelector('.hero-search-btn');
    
    const handleHeroSearch = () => {
        const query = heroSearchInput.value.trim().toLowerCase();
        if(!query) {
            showToast('검색어를 입력해주세요.');
            return;
        }
        
        showToast(`'${query}' 검색 결과를 불러옵니다...`);
        
        const grid = document.getElementById('main-property-grid');
        if(!grid) return;

        // Display Loading
        grid.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>검색 결과를 불러오고 있습니다...</p>
            </div>
        `;

        // Scroll to results
        window.scrollTo({
            top: document.getElementById('property-list-section').offsetTop - 80,
            behavior: 'smooth'
        });

        setTimeout(() => {
            let searchResults = [];
            
            // Search across all regions and properties
            Object.entries(regionData).forEach(([regionKey, data]) => {
                const regionName = data.name.toLowerCase();
                
                // If region name matches, add all properties from that region
                if (regionName.includes(query)) {
                    data.properties.forEach((prop, idx) => {
                        searchResults.push({ ...prop, regionKey, propIndex: idx });
                    });
                } else {
                    // Otherwise, check individual properties
                    data.properties.forEach((prop, idx) => {
                        if (
                            prop.name.toLowerCase().includes(query) ||
                            prop.category.toLowerCase().includes(query) ||
                            prop.area.toLowerCase().includes(query) ||
                            (prop.brand && prop.brand.toLowerCase().includes(query))
                        ) {
                            searchResults.push({ ...prop, regionKey, propIndex: idx });
                        }
                    });
                }
            });

            grid.innerHTML = '';
            document.getElementById('selected-region-name').textContent = `"${query}" 검색 결과`;

            if (searchResults.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 100px 20px;">
                        <i class="fas fa-search-minus" style="font-size: 40px; color: #444; margin-bottom: 20px;"></i>
                        <p style="color: #888; font-size: 16px;">'${query}'에 대한 검색 결과가 없습니다.</p>
                        <p style="color: #666; font-size: 14px; margin-top: 10px;">다른 키워드로 검색하거나 지도에서 지역을 선택해보세요.</p>
                    </div>
                `;
                return;
            }

            searchResults.forEach((prop) => {
                const card = document.createElement('div');
                card.className = 'all-prop-card';
                card.onclick = () => openPropertyModal(prop.regionKey, prop.propIndex);
                card.innerHTML = `
                    <div class="all-prop-img-wrap">
                        <img src="${prop.img.replace('w=100&h=100', 'w=400&h=300')}" alt="${prop.name}" class="all-prop-img">
                        <span class="mock-tag">MATCH</span>
                    </div>
                    <div class="all-prop-body">
                        <span class="all-prop-badge">${prop.category}</span>
                        <h4 class="all-prop-title">${prop.name}</h4>
                        <p class="all-prop-loc"><i class="fas fa-map-marker-alt"></i> ${prop.area}</p>
                        <div class="all-prop-price-row">
                            <span class="all-prop-price">${prop.price}</span>
                            <span class="all-prop-more">상세보기 <i class="fas fa-chevron-right"></i></span>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }, 800);
    };

    heroSearchBtn?.addEventListener('click', handleHeroSearch);
    heroSearchInput?.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleHeroSearch();
    });

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.dataset.target;
            const speed = 200;
            const updateCount = () => {
                const count = +counter.innerText.replace(/[,+]/g, '');
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc).toLocaleString();
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target.toLocaleString() + (target > 1000 ? '+' : '');
                }
            };
            counter.innerText = '0';
            updateCount();
        });
    };
    setTimeout(animateCounters, 800);

    // ==========================================
    // MAP SECTION
    // ==========================================
    const regionData = {
        seoul: { name:'서울특별시', count:'127건', avg:'12.5억', trend:'+2.3%', trendDir:'up', lat:37.5665, lng:126.9780, priceLevel:'high',
            properties:[
                { name:'래미안 원펜타스', category:'아파트', area:'강남구 반포동', price:'35억', img:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop', brand:'래미안', status:'분양중', totalPrice:'35억', pyeong:'6,850만', areaSize:'84㎡', developer:'삼성물산', builder:'삼성물산 건설부문', applyDate:'2026.04.15', resultDate:'2026.04.22', movein:'2028년 3월' },
                { name:'디에이치 아너힐즈', category:'아파트', area:'서초구 잠원동', price:'28억', img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop', brand:'디에이치', status:'청약중', totalPrice:'28억', pyeong:'5,420만', areaSize:'114㎡', developer:'현대건설', builder:'현대건설', applyDate:'2026.03.25', resultDate:'2026.04.01', movein:'2028년 6월' },
                { name:'힐스테이트 청담', category:'오피스텔', area:'강남구 청담동', price:'22억', img:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop', brand:'힐스테이트', status:'분양중', totalPrice:'22억', pyeong:'4,300만', areaSize:'84㎡', developer:'현대건설', builder:'현대건설', applyDate:'2026.05.10', resultDate:'2026.05.17', movein:'2028년 9월' },
                { name:'푸르지오 써밋', category:'아파트', area:'강남구 대치동', price:'31억', img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&h=100&fit=crop', brand:'푸르지오', status:'예정', totalPrice:'31억', pyeong:'5,900만', areaSize:'84㎡', developer:'대우건설', builder:'대우건설', applyDate:'2026.07.15', resultDate:'2026.07.22', movein:'2029년 1월' }
            ]},
        gyeonggi: { name:'경기도', count:'98건', avg:'7.2억', trend:'+1.8%', trendDir:'up', lat:37.4138, lng:127.5183, priceLevel:'mid', properties:[
            { name:'자이 더 비레지', category:'아파트', area:'수원시 영통구', price:'9.5억', img:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=100&h=100&fit=crop', brand:'자이', status:'분양중', totalPrice:'9.5억', pyeong:'1,850만', areaSize:'84㎡', developer:'GS건설', builder:'GS건설', applyDate:'2026.04.20', resultDate:'2026.04.27', movein:'2028년 5월' },
            { name:'롯데캐슬 센트럴', category:'오피스텔', area:'용인시 수지구', price:'6.8억', img:'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=100&h=100&fit=crop', brand:'롯데캐슬', status:'분양중', totalPrice:'6.8억', pyeong:'1,400만', areaSize:'59㎡', developer:'롯데건설', builder:'롯데건설', applyDate:'2026.03.30', resultDate:'2026.04.06', movein:'2027년 12월' }
        ]},
        busan: { name:'부산광역시', count:'38건', avg:'6.1억', trend:'+1.2%', trendDir:'up', lat:35.1796, lng:129.0756, priceLevel:'mid', properties:[
            { name:'래미안 해운대', category:'아파트', area:'해운대구 우동', price:'8.5억', img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&h=100&fit=crop', brand:'래미안', status:'분양중', totalPrice:'8.5억', pyeong:'1,650만', areaSize:'84㎡', developer:'삼성물산', builder:'삼성물산', applyDate:'2026.05.01', resultDate:'2026.05.08', movein:'2028년 8월' }
        ]},
        incheon: { name:'인천광역시', count:'45건', avg:'5.8억', trend:'+0.9%', trendDir:'up', lat:37.4563, lng:126.7052, priceLevel:'mid', properties:[] },
        daegu: { name:'대구광역시', count:'22건', avg:'4.8억', trend:'-0.5%', trendDir:'down', lat:35.8714, lng:128.6014, priceLevel:'low', properties:[] },
        daejeon: { name:'대전광역시', count:'18건', avg:'4.2억', trend:'+0.7%', trendDir:'up', lat:36.3504, lng:127.3845, priceLevel:'low', properties:[] },
        gwangju: { name:'광주광역시', count:'15건', avg:'3.9억', trend:'+0.3%', trendDir:'up', lat:35.1595, lng:126.8526, priceLevel:'low', properties:[] },
        ulsan: { name:'울산광역시', count:'12건', avg:'4.5억', trend:'-0.2%', trendDir:'down', lat:35.5384, lng:129.3114, priceLevel:'low', properties:[] },
        sejong: { name:'세종특별자치시', count:'10건', avg:'5.1억', trend:'+1.5%', trendDir:'up', lat:36.4800, lng:127.2590, priceLevel:'mid', properties:[] },
    };

    // Initialize map
    let map;
    const mapContainer = document.getElementById('korea-map');
    if (mapContainer && typeof L !== 'undefined') {
        map = L.map('korea-map', { center:[36.0,127.8], zoom:7, minZoom:6, maxZoom:14, attributionControl:false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        Object.entries(regionData).forEach(([key, data]) => {
            const icon = L.divIcon({
                className:'custom-marker',
                html:`<div class="marker-pin ${data.priceLevel}"><span>${data.count.replace('건','')}</span></div>`,
                iconSize:[40,40], iconAnchor:[20,40]
            });
            const marker = L.marker([data.lat, data.lng], { icon }).addTo(map);
            marker.bindPopup(`<div style="font-family:'Pretendard',sans-serif;padding:4px;"><strong style="font-size:15px;">${data.name}</strong><div style="margin-top:8px;display:flex;gap:16px;"><div><div style="font-size:10px;color:#9ba1a6;">분양</div><div style="font-size:14px;font-weight:700;">${data.count}</div></div><div><div style="font-size:10px;color:#9ba1a6;">평균</div><div style="font-size:14px;font-weight:700;">${data.avg}</div></div><div><div style="font-size:10px;color:#9ba1a6;">변동</div><div style="font-size:14px;font-weight:700;color:${data.trendDir==='up'?'#2ecc71':'#e74c3c'};">${data.trend}</div></div></div></div>`, {maxWidth:300});
            marker.on('click', () => {
                showInfoPopup(key);
                renderMainPropertyList(key, true); // Sync with property list
            });
        });
    }

    // Map View Switch Logic
    const mapTabs = document.querySelectorAll('.map-tab');
    const mapView = document.getElementById('map-view');
    const regionView = document.getElementById('region-view');

    mapTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;
            mapTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (view === 'map') {
                mapView.style.display = 'block';
                regionView.style.display = 'none';
                if (map) {
                    setTimeout(() => map.invalidateSize(), 100);
                }
            } else {
                mapView.style.display = 'none';
                regionView.style.display = 'block';
            }
        });
    });

    // Region grid card clicks
    document.querySelectorAll('.region-card').forEach(card => {
        card.addEventListener('click', () => {
            const region = card.dataset.region;
            document.querySelectorAll('.region-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            showInfoPopup(region);
            renderMainPropertyList(region, true); // Sync with property list
        });
    });

    // Info Popup close button
    document.getElementById('popup-close')?.addEventListener('click', () => {
        document.getElementById('map-info-popup').classList.remove('show');
    });

    // ==========================================
    // FILTER PANEL LOGIC
    // ==========================================
    function initDualRange(idPrefix) {
        const minInput = document.getElementById(`${idPrefix}-min`);
        const maxInput = document.getElementById(`${idPrefix}-max`);
        const fill = document.getElementById(`${idPrefix}-fill`);
        const minLabel = document.getElementById(`${idPrefix}-min-label`);
        const maxLabel = document.getElementById(`${idPrefix}-max-label`);

        function updateRange() {
            let minVal = parseInt(minInput.value);
            let maxVal = parseInt(maxInput.value);

            if (minVal > maxVal) {
                let temp = minInput.value;
                minInput.value = maxInput.value;
                maxInput.value = temp;
                minVal = parseInt(minInput.value);
                maxVal = parseInt(maxInput.value);
            }

            const minPercent = ((minVal - minInput.min) / (minInput.max - minInput.min)) * 100;
            const maxPercent = ((maxVal - minInput.min) / (minInput.max - minInput.min)) * 100;

            fill.style.left = minPercent + '%';
            fill.style.width = (maxPercent - minPercent) + '%';
            
            const unit = idPrefix === 'price' ? '억' : '㎡';
            minLabel.textContent = minVal + unit;
            maxLabel.textContent = maxVal + unit;
        }

        minInput.addEventListener('input', updateRange);
        maxInput.addEventListener('input', updateRange);
        updateRange();
    }

    initDualRange('area');
    initDualRange('price');

    // Preset Buttons
    document.querySelectorAll('.range-presets .preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.range-slider-container').querySelector('.dual-range');
            const idPrefix = group.id.replace('-range', '');
            const minInput = document.getElementById(`${idPrefix}-min`);
            const maxInput = document.getElementById(`${idPrefix}-max`);
            
            minInput.value = btn.dataset.min;
            maxInput.value = btn.dataset.max;
            
            btn.closest('.range-presets').querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Trigger input event to update UI
            minInput.dispatchEvent(new Event('input'));
        });
    });

    // Brand Chips
    document.querySelectorAll('.brand-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            if (chip.dataset.brand === 'all') {
                document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            } else {
                document.querySelector('.brand-chip[data-brand="all"]').classList.remove('active');
                chip.classList.toggle('active');
                if (!document.querySelectorAll('.brand-chip.active').length) {
                    document.querySelector('.brand-chip[data-brand="all"]').classList.add('active');
                }
            }
        });
    });

    // Date Buttons
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Filter Reset
    document.getElementById('filter-reset')?.addEventListener('click', () => {
        // Reset Inputs
        document.querySelectorAll('.filter-panel input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelector('input[value="medium"]').checked = true;
        
        // Reset Brands
        document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
        document.querySelector('.brand-chip[data-brand="all"]').classList.add('active');
        
        // Reset Dates
        document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.date-btn[data-period="all"]').classList.add('active');
        
        // Reset Sliders
        const areaMin = document.getElementById('area-min');
        const areaMax = document.getElementById('area-max');
        areaMin.value = 59;
        areaMax.value = 85;
        areaMin.dispatchEvent(new Event('input'));
        
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        priceMin.value = 1;
        priceMax.value = 50;
        priceMin.dispatchEvent(new Event('input'));

        showToast('필터가 초기화되었습니다.');
    });

    // Apply Filters
    document.querySelector('.btn-apply-filter')?.addEventListener('click', () => {
        const btn = document.querySelector('.btn-apply-filter');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 검색 중...';
        btn.disabled = true;
        
        setTimeout(() => {
            const randomCount = Math.floor(Math.random() * 100) + 10;
            document.getElementById('result-count').textContent = `${randomCount}건`;
            document.getElementById('filter-count').textContent = document.querySelectorAll('.filter-panel .active, .filter-panel input:checked').length - 1; 
            
            btn.innerHTML = `<i class="fas fa-search"></i> 필터 적용하기 <span class="result-count">${randomCount}건</span>`;
            btn.disabled = false;
            showToast(`검색 결과 ${randomCount}건이 업데이트되었습니다.`);
        }, 800);
    });

    // Map Info Popup
    function showInfoPopup(regionKey) {
        const infoPopup = document.getElementById('map-info-popup');
        const data = regionData[regionKey];
        if (!data) return;

        document.getElementById('popup-region-name').textContent = data.name;
        document.getElementById('popup-count').textContent = data.count;
        document.getElementById('popup-avg').textContent = data.avg;
        const trendEl = document.getElementById('popup-trend');
        trendEl.className = `popup-stat-value trend-${data.trendDir}`;
        trendEl.innerHTML = `<i class="fas fa-arrow-${data.trendDir}"></i> ${data.trend}`;
        
        const propContainer = document.getElementById('popup-properties');
        propContainer.innerHTML = '';
        
        if (data.properties && data.properties.length > 0) {
            // Group by Category
            const categories = [...new Set(data.properties.map(p => p.category))];
            
            categories.forEach(cat => {
                const catProps = data.properties.filter(p => p.category === cat);
                
                // Add Category Label
                const catHeader = document.createElement('div');
                catHeader.className = 'popup-category-header';
                catHeader.innerHTML = `<span>${cat}</span>`;
                propContainer.appendChild(catHeader);
                
                // Add Properties in this category
                catProps.forEach((prop) => {
                    const originalIdx = data.properties.indexOf(prop);
                    const propEl = document.createElement('div');
                    propEl.className = 'popup-property';
                    propEl.onclick = () => openPropertyModal(regionKey, originalIdx);
                    propEl.innerHTML = `
                        <img src="${prop.img}" alt="${prop.name}" class="popup-property-img">
                        <div class="popup-property-info">
                            <h5>${prop.name}</h5>
                            <p>${prop.area}</p>
                        </div>
                        <span class="popup-property-price">${prop.price}</span>
                    `;
                    propContainer.appendChild(propEl);
                });
            });
        } else {
            propContainer.innerHTML = '<p style="font-size:13px;color:#666;text-align:center;padding:16px;">등록된 매물이 없습니다.</p>';
        }
        infoPopup.classList.add('show');
        window.currentRegionKey = regionKey;
    }

    // All Properties Modal Logic
    const allPropsModal = document.getElementById('all-properties-modal');
    const allPropsGrid = document.getElementById('all-props-grid');

    window.openAllPropertiesModal = function() {
        const regionKey = window.currentRegionKey;
        const data = regionData[regionKey];
        if (!data) return;

        const totalCount = parseInt(data.count);
        document.getElementById('all-props-title').textContent = `${data.name} 전체 분양 현장`;
        document.getElementById('all-props-subtitle').textContent = `현재 ${data.count}의 분양 정보가 등록되어 있습니다.`;
        
        allPropsGrid.innerHTML = '';
        
        // Mock data generators
        const mockBrands = ['래미안', '힐스테이트', '푸르지오', '자이', '롯데캐슬', '더샵', '아이파크', 'e편한세상'];
        const mockCategories = ['아파트', '오피스텔', '주상복합', '도시형생활주택'];
        const mockImages = [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be'
        ];

        // Helper to parse price string to number for sorting
        const parsePrice = (priceStr) => {
            if (!priceStr) return 0;
            const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
            return isNaN(num) ? 0 : num;
        };

        // Combine real and mock properties
        let displayList = [...data.properties];
        
        // Fill up to the totalCount (or a reasonable limit for demo, e.g., 20) with mock data
        const displayLimit = Math.min(totalCount, 24); 
        
        for (let i = displayList.length; i < displayLimit; i++) {
            const brand = mockBrands[i % mockBrands.length];
            const category = mockCategories[Math.floor(Math.random() * mockCategories.length)];
            const priceNum = (Math.floor(Math.random() * 20) + 5);
            
            displayList.push({
                name: `${brand} ${data.name} 스카이뷰 ${i+1}`,
                category: category,
                area: `${data.name} 중심상업지구 ${i+1}번길`,
                price: priceNum + '억',
                priceVal: priceNum,
                img: `${mockImages[i % mockImages.length]}?w=400&h=300&fit=crop`,
                brand: brand,
                status: '분양중',
                isMock: true
            });
        }

        // Sort by price
        const sortType = document.getElementById('all-props-sort').value;
        displayList.sort((a, b) => {
            const valA = a.priceVal || parsePrice(a.price);
            const valB = b.priceVal || parsePrice(b.price);
            return sortType === 'high' ? valB - valA : valA - valB;
        });
        
        if (displayList.length > 0) {
            displayList.forEach((prop, idx) => {
                const card = document.createElement('div');
                card.className = 'all-prop-card';
                card.onclick = () => {
                    if (prop.isMock) {
                        showToast(`상세 정보 준비 중입니다. (${prop.name})`);
                    } else {
                        allPropsModal.classList.remove('show');
                        openPropertyModal(regionKey, idx);
                    }
                };
                card.innerHTML = `
                    <div class="all-prop-img-wrap">
                        <img src="${prop.img}" alt="${prop.name}" class="all-prop-img">
                        ${prop.isMock ? '<span class="mock-tag">추천</span>' : ''}
                    </div>
                    <div class="all-prop-body">
                        <span class="all-prop-badge">${prop.category}</span>
                        <h4 class="all-prop-title">${prop.name}</h4>
                        <p class="all-prop-loc"><i class="fas fa-map-marker-alt"></i> ${prop.area}</p>
                        <div class="all-prop-price-row">
                            <span class="all-prop-price">${prop.price}</span>
                            <span class="all-prop-more">상세보기 <i class="fas fa-chevron-right"></i></span>
                        </div>
                    </div>
                `;
                allPropsGrid.appendChild(card);
            });
        } else {
            allPropsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 100px; color: #666;">등록된 매물이 없습니다.</div>';
        }

        allPropsModal.classList.add('show');
    };

    document.getElementById('all-props-sort')?.addEventListener('change', () => {
        window.openAllPropertiesModal();
    });

    document.getElementById('all-props-close')?.addEventListener('click', () => allPropsModal.classList.remove('show'));
    allPropsModal?.addEventListener('click', (e) => { if (e.target === allPropsModal) allPropsModal.classList.remove('show'); });
    document.querySelector('.popup-view-all')?.addEventListener('click', openAllPropertiesModal);

    // ==========================================
    // PROPERTY DETAIL MODAL
    // ==========================================
    const modal = document.getElementById('property-modal');
    window.openPropertyModal = function(regionKey, propIndex) {
        const data = regionData[regionKey];
        if (!data || !data.properties[propIndex]) return;
        const prop = data.properties[propIndex];
        document.getElementById('modal-main-img').src = prop.img.replace('w=100&h=100', 'w=800');
        document.getElementById('modal-title').textContent = prop.name;
        document.getElementById('modal-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.name} ${prop.area}`;
        document.getElementById('modal-brand').textContent = prop.brand || '브랜드';
        document.getElementById('modal-status').textContent = prop.status || '분양중';
        document.getElementById('modal-price').textContent = prop.totalPrice || prop.price;
        document.getElementById('modal-pyeong').textContent = prop.pyeong || '-';
        document.getElementById('modal-area').textContent = prop.areaSize || '-';
        document.getElementById('modal-developer').textContent = prop.developer || '-';
        document.getElementById('modal-builder').textContent = prop.builder || '-';
        document.getElementById('modal-apply-date').textContent = prop.applyDate || '-';
        document.getElementById('modal-result-date').textContent = prop.resultDate || '-';
        document.getElementById('modal-movein').textContent = prop.movein || '-';
        modal.classList.add('show');
    };
    document.getElementById('modal-close')?.addEventListener('click', () => modal.classList.remove('show'));
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });

    // ==========================================
    // INTERACTIVE CALENDAR SYSTEM
    // ==========================================
    let calendarEvents = JSON.parse(localStorage.getItem('gonggan_calendar') || '[]');
    let currentCalDate = new Date();
    let selectedCalDate = new Date();

    function saveCalendar() { 
        localStorage.setItem('gonggan_calendar', JSON.stringify(calendarEvents)); 
        renderCalendarUI();
        renderCalendarEvents();
        updateNavBadges();
    }

    function updateNavBadges() {
        const cb = document.getElementById('nav-calendar-badge');
        if (cb) { 
            cb.textContent = calendarEvents.length; 
            cb.style.display = calendarEvents.length ? 'block' : 'none'; 
        }
    }

    window.removeCalendarEvent = (id) => {
        calendarEvents = calendarEvents.filter(c => c.id !== id);
        saveCalendar();
    };

    function renderCalendarUI() {
        const container = document.getElementById('calendar-ui');
        if (!container) return;

        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        
        let html = `
            <div class="calendar-month-header">
                <button class="cal-nav-btn" onclick="changeCalMonth(-1)"><i class="fas fa-chevron-left"></i></button>
                <h4>${year}년 ${monthNames[month]}</h4>
                <button class="cal-nav-btn" onclick="changeCalMonth(1)"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-label">일</div>
                <div class="calendar-day-label">월</div>
                <div class="calendar-day-label">화</div>
                <div class="calendar-day-label">수</div>
                <div class="calendar-day-label">목</div>
                <div class="calendar-day-label">금</div>
                <div class="calendar-day-label">토</div>
        `;

        // Prev month days
        for (let i = firstDay; i > 0; i--) {
            html += `<div class="calendar-day disabled">${prevLastDate - i + 1}</div>`;
        }

        const today = new Date();
        for (let i = 1; i <= lastDate; i++) {
            const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = i === selectedCalDate.getDate() && month === selectedCalDate.getMonth() && year === selectedCalDate.getFullYear();
            const hasEvent = calendarEvents.some(e => {
                const ed = new Date(e.date);
                return ed.getDate() === i && ed.getMonth() === month && ed.getFullYear() === year;
            });

            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvent ? 'has-event' : ''}" 
                     onclick="selectCalDate(${i})">
                    ${i}
                </div>
            `;
        }

        html += `</div>`;
        container.innerHTML = html;
    }

    window.changeCalMonth = (offset) => {
        currentCalDate.setMonth(currentCalDate.getMonth() + offset);
        renderCalendarUI();
    };

    window.selectCalDate = (day) => {
        selectedCalDate = new Date(currentCalDate.getFullYear(), currentCalDate.getMonth(), day);
        renderCalendarUI();
        renderCalendarEvents();
    };

    function renderCalendarEvents() {
        const list = document.getElementById('calendar-list');
        if (!list) return;

        const dayEvents = calendarEvents.filter(e => {
            const ed = new Date(e.date);
            return ed.getDate() === selectedCalDate.getDate() && 
                   ed.getMonth() === selectedCalDate.getMonth() && 
                   ed.getFullYear() === selectedCalDate.getFullYear();
        });

        if (dayEvents.length === 0) {
            list.innerHTML = `
                <div class="sidebar-empty">
                    <p>${selectedCalDate.getMonth()+1}월 ${selectedCalDate.getDate()}일 일정이 없습니다.</p>
                </div>`;
            return;
        }

        list.innerHTML = dayEvents.map(e => `
            <div class="calendar-event-item">
                <div class="event-item-title">${e.name}</div>
                <div class="event-item-time"><i class="far fa-clock"></i> ${e.type || '종일'}</div>
                <div class="btn-event-del" onclick="removeCalendarEvent(${e.id})"><i class="fas fa-times"></i></div>
            </div>
        `).join('');
    }

    const eventAddForm = document.getElementById('event-add-form');
    const eventTitleInput = document.getElementById('event-title-input');
    const eventTimeInput = document.getElementById('event-time-input');

    document.getElementById('btn-add-event')?.addEventListener('click', () => {
        if (eventAddForm) {
            const isHidden = eventAddForm.style.display === 'none';
            eventAddForm.style.display = isHidden ? 'block' : 'none';
            if (isHidden) eventTitleInput.focus();
        }
    });

    document.getElementById('btn-event-save')?.addEventListener('click', () => {
        const name = eventTitleInput?.value.trim();
        const type = eventTimeInput?.value.trim() || '종일';
        
        if (!name) {
            showToast('일정 이름을 입력해주세요.');
            return;
        }

        calendarEvents.push({
            id: Date.now(),
            name: name,
            type: type,
            date: selectedCalDate.toISOString()
        });
        
        saveCalendar();
        showToast('일정이 추가되었습니다.');
        
        // Reset and hide form
        if (eventTitleInput) eventTitleInput.value = '';
        if (eventTimeInput) eventTimeInput.value = '';
        if (eventAddForm) eventAddForm.style.display = 'none';
    });

    // Company About Modal
    window.openAboutModal = function() {
        document.getElementById('about-modal')?.classList.add('show');
    };

    document.getElementById('nav-about')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAboutModal();
    });

    document.getElementById('about-modal-close')?.addEventListener('click', () => {
        document.getElementById('about-modal')?.classList.remove('show');
    });

    document.getElementById('about-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'about-modal') e.target.classList.remove('show');
    });

    // ==========================================
    // TOAST & FAB
    // ==========================================
    function showToast(m) {
        const t = document.createElement('div');
        t.className = 'toast-notification';
        t.innerHTML = m;
        t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;padding:12px 24px;border-radius:12px;z-index:99999;backdrop-filter:blur(10px);';
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity='0'; t.style.transition='0.3s'; setTimeout(()=>t.remove(),300); }, 2500);
    }

    const fabContainer = document.getElementById('fab-container');
    document.getElementById('fab-trigger')?.addEventListener('click', () => fabContainer?.classList.toggle('open'));
    document.getElementById('fab-chat')?.addEventListener('click', () => { fabContainer?.classList.remove('open'); openConsultModal('chat'); });
    document.getElementById('fab-visit')?.addEventListener('click', () => { fabContainer?.classList.remove('open'); openConsultModal('visit'); });

    // ==========================================
    // CONSULTATION
    // ==========================================
    const consultModal = document.getElementById('consult-modal');
    window.openConsultModal = function(tab = 'chat') {
        consultModal?.classList.add('show');
        document.querySelectorAll('.consult-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.consult-content').forEach(c => c.classList.remove('active'));
        document.querySelector(`.consult-tab[data-ctab="${tab}"]`)?.classList.add('active');
        document.getElementById('ctab-' + tab)?.classList.add('active');
    };
    document.getElementById('consult-close')?.addEventListener('click', () => consultModal?.classList.remove('show'));
    document.querySelectorAll('.consult-tab').forEach(tab => {
        tab.addEventListener('click', () => openConsultModal(tab.dataset.ctab));
    });

    // Chat
    const chatInput = document.getElementById('chat-input');
    document.querySelector('.chat-send-btn')?.addEventListener('click', () => {
        const text = chatInput?.value.trim();
        if (!text) return;
        const preview = document.querySelector('.chat-preview');
        if (preview) {
            preview.innerHTML += `<div class="chat-bubble user"><span>${text}</span></div>`;
            chatInput.value = '';
            setTimeout(() => {
                let response = `감사합니다! "${text}"에 대해 '공 간' 전문 상담 센터에서 분석 중입니다. 상세한 상담을 위해 '분양 광고 문의' 페이지를 이용하시거나 상담 예약을 남겨주시면 감사하겠습니다. 😊`;
                if (text.includes('가격') || text.includes('분양가')) {
                    response = "현재 분양가는 타입별로 상이하며 평당가 기준 약 6,000만원대부터 형성되어 있습니다. 자세한 상담을 원하시면 연락처를 남겨주세요!";
                } else if (text.includes('위치')) {
                    response = "해당 단지들은 생활 인프라가 완비된 핵심 입지에 위치해 있습니다. 모델하우스 방문 예약을 통해 직접 확인해 보시는 건 어떨까요?";
                }
                preview.innerHTML += `<div class="chat-bubble bot"><span>${response}</span></div>`;
                preview.scrollTop = preview.scrollHeight;
            }, 1000);
        }
    });

    document.getElementById('visit-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('visit-name').value;
        const site = document.getElementById('visit-site').value;
        const date = document.getElementById('visit-date').value;
        const time = document.getElementById('visit-time').value;
        
        // Proactive: Add to calendar
        calendarEvents.push({
            id: Date.now(),
            name: `[방문예약] ${site}`,
            type: time,
            date: new Date(date).toISOString()
        });
        saveCalendar();
        
        consultModal?.classList.remove('show');
        showToast(`✅ ${name}님, ${site} 방문 예약이 접수되어 캘린더에 등록되었습니다! (${date} ${time})`);
    });

    // Experts Data
    const expertData = {
        '김민준': {
            role: 'Senior Consultant',
            tag: '부동산 컨설팅',
            img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop',
            bio: '15년 경력의 수익형 부동산 분석 전문가입니다. 국내 주요 시행사 및 대기업 자산운용팀을 거쳐 현재 \'공 간\' 자문위원으로 활동 중입니다. 데이터 기반의 철저한 시장 분석을 통해 고객님의 자산 가치를 극대화하는 최적의 솔루션을 제공합니다.',
            specialties: ['시장분석', '자산포트폴리오', '수수료최적화']
        },
        '이지원': {
            role: 'Legal Advisor',
            tag: '세무/법률 상담',
            img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop',
            bio: '부동산 증여 및 상속 세무 전문 세무사입니다. 복잡한 세법 개정안을 고객님의 상황에 맞춰 알기 쉽게 풀이해 드립니다. 합리적인 절세 전략과 법률 가이드로 소중한 자산을 안전하게 관리해 드립니다.',
            specialties: ['절세전략', '증여상속', '부동산특별법']
        },
        '박서준': {
            role: 'Financial Specialist',
            tag: '금융 솔루션',
            img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop',
            bio: '전직 시중은행 프라이빗 뱅커(PB) 출신의 금융 전문가입니다. 급변하는 대출 규제 트렌드를 완벽히 분석하여, 청약 당첨부터 입주까지 빈틈없는 자금 조달 계획을 수립해 드립니다.',
            specialties: ['자금계획', '대출상담', 'LTV/DSR가이드']
        },
        '정아름': {
            role: 'Design Architect',
            tag: '인테리어 디자인',
            img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop',
            bio: '공간의 미학을 아는 디자이너이자 건축가입니다. 프리미엄 주거 공간 컨설팅을 통해 고객님의 가치를 반영한 인테리어 디자인을 제안합니다. 시공부터 감리까지 전문가의 손길로 완성해 드립니다.',
            specialties: ['공간디자인', '프리미엄가구', '친환경자재']
        }
    };

    window.openExpertModal = function(name) {
        const data = expertData[name];
        if (!data) return;

        document.getElementById('expert-modal-img').src = data.img;
        document.getElementById('expert-modal-tag').textContent = data.tag;
        document.getElementById('expert-modal-name').innerHTML = `${name} <small>${data.role}</small>`;
        document.getElementById('expert-modal-bio').textContent = data.bio;
        document.getElementById('expert-modal-specialties').innerHTML = data.specialties.map(s => `<span>#${s}</span>`).join('');
        
        document.getElementById('expert-modal').classList.add('show');
    };

    document.querySelectorAll('.expert-card-mini').forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('h5').textContent;
            openExpertModal(name);
        });
    });

    document.getElementById('expert-modal-close')?.addEventListener('click', () => {
        document.getElementById('expert-modal').classList.remove('show');
    });

    document.getElementById('expert-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'expert-modal') e.target.classList.remove('show');
    });

    // Event Listeners (Main Actions)
    document.querySelectorAll('.btn-contact').forEach(btn => {
        btn.addEventListener('click', () => { window.location.href = 'inquiry.html'; });
    });
    document.querySelectorAll('.btn-modal-inquiry').forEach(btn => {
        btn.addEventListener('click', () => { openConsultModal('chat'); });
    });
    
    document.getElementById('nav-calendar')?.addEventListener('click', () => { 
        renderCalendarUI();
        renderCalendarEvents();
        document.getElementById('calendar-sidebar')?.classList.add('open'); 
    });
    document.getElementById('calendar-close')?.addEventListener('click', () => document.getElementById('calendar-sidebar')?.classList.remove('open'));

    // ==========================================
    // SCROLL NAVIGATION
    // ==========================================
    const scrollNav = document.getElementById('scroll-nav');
    const scrollTopBtn = document.getElementById('scroll-top');
    const scrollBottomBtn = document.getElementById('scroll-bottom');

    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollBottomBtn?.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    // ==========================================
    // MAIN PROPERTY LIST (Section 3)
    // ==========================================
    // State for property list expansion
    let currentDisplayProps = [];
    let currentRegionKey = 'seoul';
    let isExpanded = false;

    function renderMainPropertyList(regionKey, scrollTo = false, expanded = false) {
        const grid = document.getElementById('main-property-grid');
        const loadMoreBtn = document.querySelector('.btn-load-more');
        const data = regionData[regionKey];
        
        if(!grid || !data) return;

        currentRegionKey = regionKey;
        isExpanded = expanded;
        document.getElementById('selected-region-name').textContent = data.name;

        // If not expanded, show only first 4. If expanded, or if global search results, show all.
        // For search results (handled in handleHeroSearch), we'll handle separately or unify.
        
        // Let's unify with a helper
        const renderCards = (props, targetGrid) => {
            targetGrid.innerHTML = '';
            if(!props || props.length === 0) {
                targetGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #666;">해당 지역에 등록된 추천 매물이 없습니다.</div>';
                if(loadMoreBtn) loadMoreBtn.style.display = 'none';
                return;
            }

            const visibleProps = isExpanded ? props : props.slice(0, 4);
            
            visibleProps.forEach((prop, idx) => {
                const card = document.createElement('div');
                card.className = 'all-prop-card fade-in';
                card.onclick = () => openPropertyModal(prop.regionKey || regionKey, prop.propIndex !== undefined ? prop.propIndex : idx);
                card.innerHTML = `
                    <div class="all-prop-img-wrap">
                        <img src="${prop.img.replace('w=100&h=100', 'w=400&h=300')}" alt="${prop.name}" class="all-prop-img">
                        <span class="mock-tag">${prop.status === '청약중' ? 'URGENT' : 'HOT'}</span>
                    </div>
                    <div class="all-prop-body">
                        <span class="all-prop-badge">${prop.category}</span>
                        <h4 class="all-prop-title">${prop.name}</h4>
                        <p class="all-prop-loc"><i class="fas fa-map-marker-alt"></i> ${prop.area}</p>
                        <div class="all-prop-price-row">
                            <span class="all-prop-price">${prop.price}</span>
                            <span class="all-prop-more">상세보기 <i class="fas fa-chevron-right"></i></span>
                        </div>
                    </div>
                `;
                targetGrid.appendChild(card);
            });

            // Update Load More Button
            if(loadMoreBtn) {
                if(props.length <= 4) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'inline-block';
                    loadMoreBtn.innerHTML = isExpanded ? 
                        '매물 리스트 접기 <i class="fas fa-chevron-up"></i>' : 
                        `전체 매물 더보기 (${props.length - 4}개 더 있음) <i class="fas fa-chevron-down"></i>`;
                }
            }
        };

        if(!expanded) {
            grid.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>매물을 불러오고 있습니다...</p>
                </div>
            `;
            setTimeout(() => {
                renderCards(data.properties, grid);
                if(scrollTo) {
                    window.scrollTo({
                        top: document.getElementById('property-list-section').offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }, 600);
        } else {
            renderCards(data.properties, grid);
        }
    }

    window.togglePropertyExpansion = function() {
        isExpanded = !isExpanded;
        const grid = document.getElementById('main-property-grid');
        const queryTitle = document.getElementById('selected-region-name').textContent;
        
        // If it's a search result, we might need different logic. 
        // For simplicity, let's assume we are toggling the currentRegionKey's properties if not in search mode.
        if (queryTitle.includes('검색 결과')) {
            // Re-run search logic with expansion? 
            // Or just keep the current behavior for search results (show all).
            // Let's just focus on the region selection for now.
            renderMainPropertyList(currentRegionKey, false, isExpanded);
        } else {
            renderMainPropertyList(currentRegionKey, false, isExpanded);
        }

        if(!isExpanded) {
            window.scrollTo({
                top: document.getElementById('property-list-section').offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    // Init
    renderCalendarUI();
    renderCalendarEvents();
    updateNavBadges();
    renderMainPropertyList('seoul'); // Initial load
});
