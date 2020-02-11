package com.nsis.whisper.whisper.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
public class WhisperController {

    private static List<Map<String, String>> names = new ArrayList<>();

    static {
        Map<String, String> friends = new HashMap<>();
        friends.put("Jan.0x12.V", "Jan.0x12.S");
//        friends.put("Jan.LY","Jan.YL");
        names.add(friends);
    }

    private static Map<String, String> content = new HashMap<>();

    @RequestMapping(value = "/l", method = RequestMethod.GET)
    public String l(String n) {
        return String.valueOf(!"".equals(getFriend(n)));
    }

    @RequestMapping(value = "/s", method = RequestMethod.GET)
    public String s(String n, String c) {
        content.put(n + "_" + randomStr(), c);
        return "ok";
    }

    @RequestMapping(value = "/r", method = RequestMethod.GET)
    public List<String> r(String n) {
        List<String> c = new ArrayList<>();
        String friendName = getFriend(n);
        if ("".equals(friendName)) {
            return c;
        }
        Iterator<Map.Entry<String, String>> it = content.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, String> entry = it.next();
            String key = entry.getKey();
            if (key.contains(friendName)) {
                c.add(entry.getValue());
                it.remove();
            }
        }
        return c;
    }

    private String randomStr() {
        long sec = System.currentTimeMillis();
        return String.valueOf(sec);
    }

    private String getFriend(String name) {
        for (Map<String, String> friend : names) {
            for (Map.Entry<String, String> entry : friend.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();
                if (key.equals(name)) {
                    return value;
                }
                if (value.equals(name)) {
                    return key;
                }
            }
        }
        return "";
    }
}
