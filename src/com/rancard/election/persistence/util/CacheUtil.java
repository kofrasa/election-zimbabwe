package com.rancard.election.persistence.util;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import com.google.appengine.api.memcache.jsr107cache.GCacheFactory;
import com.rancard.election.json.WardApi;

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheException;
import net.sf.jsr107cache.CacheFactory;
import net.sf.jsr107cache.CacheManager;

public class CacheUtil {
	private static final Logger log = Logger.getLogger(WardApi.class.getName());
	private static Cache cache;
	
	private static Cache createCache() {
		
		if(cache == null){
			log.severe("Will create cache");
			Map<String, Integer> props = new HashMap<>();
		    props.put(GCacheFactory.EXPIRATION_DELTA, 60000);
		        
	        try {
	            CacheFactory cacheFactory = CacheManager.getInstance().getCacheFactory();
	            cache = cacheFactory.createCache(props);
	        } catch (CacheException e) {
	            log.severe("Exception creating cache: "+e.getMessage());
	        }
		}
        return cache;
	}
	
	public static void cache(String key, Object value) {
		Cache cache = createCache();		
		cache.put(key, value);
	}
	
	public static Object getCachedObject(String key) {
		Cache cache = createCache();
		return cache.get(key);
	}
}
