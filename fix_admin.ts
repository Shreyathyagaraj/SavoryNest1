import fs from 'fs';
const path = 'src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Find the section that is causing issues
// The last area chart ends with:
//                         </AreaChart>
//                      </ResponsiveContainer>
//                    </div>
//                  </div>
//               </div>
//             </div>
//           </div>
//         )}

const search = `                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
               </div>
             </div>
           </div>
         )}`;

const replace = `                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
            </div>
         )}`;

// Try to be more resilient with a regex
const regex = /<\/AreaChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\}\)/;
const newContent = content.replace(/<\/AreaChart>[\s\S]*?<\/ResponsiveContainer>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\}\)/, '<\/AreaChart>\n                      <\/ResponsiveContainer>\n                    <\/div>\n                  <\/div>\n                <\/div>\n            <\/div>\n         })');

if (content !== newContent) {
  fs.writeFileSync(path, newContent);
  console.log('Successfully fixed Admin.tsx structure');
} else {
  console.log('Could not find target pattern in Admin.tsx');
}
