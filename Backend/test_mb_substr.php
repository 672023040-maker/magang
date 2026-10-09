<?php

$content = "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00";

echo "Content: " . bin2hex($content) . "\n";
echo "substr 0,3: " . bin2hex(substr($content, 0, 3)) . "\n";
echo "mb_substr 0,3: " . bin2hex(mb_substr($content, 0, 3)) . "\n";
echo "mb_substr 0,3, 8bit: " . bin2hex(mb_substr($content, 0, 3, '8bit')) . "\n";

echo "\nstr_starts_with substr: " . (str_starts_with(substr($content, 0, 3), "\xFF\xD8\xFF") ? 'yes' : 'no') . "\n";
echo "str_starts_with mb_substr: " . (str_starts_with(mb_substr($content, 0, 3), "\xFF\xD8\xFF") ? 'yes' : 'no') . "\n";
echo "str_starts_with mb_substr 8bit: " . (str_starts_with(mb_substr($content, 0, 3, '8bit'), "\xFF\xD8\xFF") ? 'yes' : 'no') . "\n";