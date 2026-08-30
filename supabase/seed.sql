-- Seed Categories (Editorial Desks)
INSERT INTO public.categories (name_en, name_hi, slug, display_order, icon_name, description_hi) VALUES
  ('Politics', 'सियासत', 'siyasat', 1, 'landmark', 'गोंडा, कैसरगंज और उत्तर प्रदेश की राजनीतिक हलचल और चुनावी विश्लेषण'),
  ('Gonda Region', 'गोंडा आंचल', 'gonda-aanchal', 2, 'map-pin', 'गोंडा जिले की स्थानीय खबरें, समस्याएं और जमीनी रिपोर्टिंग'),
  ('History & Heritage', 'इतिहास व विरासत', 'itihas-virasat', 3, 'scroll', 'गोंडा और देवीपाटन मंडल का गौरवशाली इतिहास, धरोहर और प्राचीन गाथाएं'),
  ('Public Voice / Inspiration', 'जन-आवाज़ / प्रेरणा', 'jan-awaaz', 4, 'megaphone', 'जनता की आवाज, जन समस्याएं और समाज को प्रेरित करने वाले व्यक्तित्व'),
  ('Literature & Stage', 'साहित्य एवं मंच', 'sahitya-manch', 5, 'book-open', 'अवधी व हिंदी साहित्य, कवि सम्मेलन, नाटक और कला मंच'),
  ('Video Desk', 'वीडियो डेस्क', 'video-desk', 6, 'play-circle', 'इंटरनेट की आवाज़ के विशेष वीडियो बुलेटिन और ग्राउंड रिपोर्ट्स'),
  ('Gonda Directory', 'गोंडा डायरेक्टरी', 'gonda-directory', 7, 'building-2', 'गोंडा के प्रमुख व्यवसाय, अस्पताल, डॉक्टर और सेवाएं')
ON CONFLICT (slug) DO NOTHING;

-- Seed Tags
INSERT INTO public.tags (name_hi, name_en, slug, usage_count) VALUES
  ('गोंडा', 'Gonda', 'gonda', 12),
  ('कैसरगंज', 'Kaiserganj', 'kaiserganj', 8),
  ('पूर्वांचल', 'Purvanchal', 'purvanchal', 5),
  ('उत्तर प्रदेश', 'Uttar Pradesh', 'uttar-pradesh', 15),
  ('विकास कार्य', 'Development', 'development', 6),
  ('जांच रिपोर्ट', 'Investigation', 'investigation', 9),
  ('इतिहास', 'History', 'history', 4)
ON CONFLICT (slug) DO NOTHING;
